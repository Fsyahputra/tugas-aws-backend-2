const ReplyRepository = require("../../Domains/replies/replyRepository");
const CommentRepository = require("../../Domains/comment/commentRepository");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const UserRepository = require("../../Domains/users/UserRepository");
const AuthenticationTokenManager = require("../security/AuthenticationTokenManager");
/**
 * @typedef {object} Replies
 * @property {string} username
 * @property {string} id
 * @property {Date} date
 * @property {string} content
 *
 */

/**
 * @typedef {object} GetDetailThreadUseCasePayload
 * @property {string} threadId
 *
 * */

/**
 *  @typedef {object} Comment
 *  @property {string} id
 *  @property {string} username
 *  @property {Date} date
 *  @property {string} content
 *  @property {Replies[]} replies
 *
 *
 */

/**
 * @typedef {object} GetDetailThreadUseCaseRT
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {Date} date
 * @property {string} username
 * @property {Comment[]} comments
 */
class GetDetailThreadUseCase {
  /**
   * @param {CommentRepository} crp
   * @param {UserRepository} usrp
   * @param {ThreadRepository} thrp
   * @param {ReplyRepository} rpyrp
   */
  constructor(usrp, crp, thrp, rpyrp) {
    this._crp = crp;
    this._usrp = usrp;
    this._thrp = thrp;
    this._rpyrp = rpyrp;
  }
  /**
   * @param {GetDetailThreadUseCasePayload} payload
   * @public
   * @returns {Promise< GetDetailThreadUseCaseRT >}
   */
  async execute(payload) {
    this._verifyPayload(payload);
    const { threadId } = payload;
    await this._thrp.mustExistOrThrowId(threadId);
    const thread = await this._thrp.getThreadById(threadId);
    const gettedComment = await this._crp.getByThreadId(threadId);
    const { username } = await this._usrp.getUserById(thread.owner);
    /**
     * @type {Comment[]}
     */
    const comments = [];
    for (const com of gettedComment) {
      let content = com.content;
      if (com.isDeleted) {
        content = "**komentar telah dihapus**";
      }
      const reply = await this._rpyrp.getByCommentId(com.id);
      /**
       * @type {Replies[]}
       */
      const replies = [];
      for (const rep of reply) {
        const user = await this._usrp.getUserById(rep.owner);
        let content = rep.content;
        if (rep.isDelete) {
          content = "**balasan telah dihapus**";
        }
        replies.push({
          content: content,
          date: rep.date,
          id: rep.id,
          username: user.username,
        });
      }
      comments.push({
        date: com.date,
        id: com.id,
        username: com.username,
        content,
        replies,
      });
    }

    comments.sort((a, b) => {
      const timeA =
        a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
      const timeB =
        b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
      return timeA - timeB;
    });

    comments.forEach((comment) => {
      comment.replies.sort((a, b) => {
        const timeA =
          a.date instanceof Date
            ? a.date.getTime()
            : new Date(a.date).getTime();
        const timeB =
          b.date instanceof Date
            ? b.date.getTime()
            : new Date(b.date).getTime();
        return timeA - timeB;
      });
    });

    return {
      body: thread.body,
      date: thread.date,
      id: threadId,
      title: thread.title,
      username: username,
      comments,
    };
  }

  /**
   * @param {  GetDetailThreadUseCasePayload } payload
   * @private
   */
  _verifyPayload(payload) {
    if (!payload) {
      throw new Error("Payload tidak boleh kosong");
    }
    const { threadId } = payload;

    if (!threadId) {
      throw new Error("threadId harus ada");
    }

    if (typeof threadId !== "string") {
      throw new Error("threadId harus berupa string");
    }
  }
}

module.exports = GetDetailThreadUseCase;

const InvariantError = require("../../Commons/exceptions/InvariantError");
const CommentRepository = require("../../Domains/comment/commentRepository");
const NewReplies = require("../../Domains/replies/entities/newReplies");
const ReplyRepository = require("../../Domains/replies/replyRepository");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const UserRepository = require("../../Domains/users/UserRepository");
const AuthenticationTokenManager = require("../security/AuthenticationTokenManager");

/**
 * @typedef {object} AddReplyUseCaseRT
 * @property {string} id
 * @property {string} content
 * @property {string} owner
 */

/**
 * @typedef {object} AddReplyUseCasePayload
 * @property {string} accessToken
 * @property {string} content
 * @property {string} threadId
 * @property {string} commentId
 */

class AddRepylUseCase {
  /**
   * @param {CommentRepository} crp
   * @param {ThreadRepository} thrp
   * @param {AuthenticationTokenManager} tm
   * @param {UserRepository} usrp
   * @param {ReplyRepository} rpyrp
   */
  constructor(thrp, usrp, crp, tm, rpyrp) {
    this._thrp = thrp;
    this._usrp = usrp;
    this._crp = crp;
    this._tm = tm;
    this._rpyrp = rpyrp;
  }

  /**
   * @param {AddReplyUseCasePayload} payload
   */
  async excute(payload) {
    this._verifyPayload(payload);
    const { accessToken, content, commentId, threadId } = payload;
    const decoded = await this._tm.decodePayload(accessToken);
    await this._usrp.mustExistOrThrowById(decoded.id);
    await this._crp.mustExistOrThrowId(commentId);
    await this._thrp.mustExistOrThrowId(threadId);
    const newReply = new NewReplies({
      content,
      owner: decoded.id,
      comment_id: commentId,
      thread_id: threadId,
    });

    const addedReply = await this._rpyrp.add({
      content: newReply.content,
      owner: decoded.id,
      threadId: newReply.threadId,
      commentId: newReply.commentId,
    });
    return {
      id: addedReply.id,
      content: addedReply.content,
      owner: addedReply.owner,
    };
  }
  /**
   * @param {AddReplyUseCasePayload} payload
   * @private
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("REPLY_COMMENT.NOT_OBJECT");
    }

    const { accessToken, content, threadId, commentId } = payload;

    if (!accessToken) {
      throw new Error("REPLY_COMMENT.AUTHENTICATION_NOT_FOUND");
    }
    if (!content || !threadId || !commentId) {
      throw new Error("REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof accessToken !== "string" ||
      typeof content !== "string" ||
      typeof threadId !== "string" ||
      typeof commentId !== "string"
    ) {
      throw new Error("REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddRepylUseCase;

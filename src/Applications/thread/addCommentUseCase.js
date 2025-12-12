const InvariantError = require("../../Commons/exceptions/InvariantError");
const AuthenticationRepository = require("../../Domains/authentications/AuthenticationRepository");
const CommentRepository = require("../../Domains/comment/commentRepository");
const NewComment = require("../../Domains/comment/entities/newComment");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const UserRepository = require("../../Domains/users/UserRepository");
const AuthenticationTokenManager = require("../security/AuthenticationTokenManager");

/**
 * @typedef {object} AddCommentUseCasePayload
 * @property {string} accessToken
 * @property {string} threadId
 * @property {string} content
 */

/**
 * @typedef {object} AddCommentUseCaseRT
 * @property {string} id
 * @property {string} content
 * @property {string} owner
 */
class AddCommentUseCase {
  /**
   * @param {AuthenticationTokenManager} tm
   * @param {CommentRepository} crp
   * @param {UserRepository} usrp
   * @param {ThreadRepository} thrp
   */
  constructor(tm, crp, usrp, thrp) {
    this._tm = tm;
    this._crp = crp;
    this._usrp = usrp;
    this._thrp = thrp;
  }

  /**
   * @param {AddCommentUseCasePayload} payload
   * @public
   * @returns {Promise<AddCommentUseCaseRT>}
   */
  async execute(payload) {
    this._verifyPayload(payload);
    const { accessToken, threadId, content } = payload;
    const decoded = await this._tm.decodePayload(accessToken);
    await this._usrp.mustExistOrThrowById(decoded.id);
    await this._thrp.mustExistOrThrowId(threadId);
    const ent = new NewComment({
      content,
      owner: decoded.id,
      thread_id: threadId,
    });
    const addedComment = await this._crp.add({
      content: ent.content,
      owner: ent.owner,
      threadId: threadId,
      username: decoded.username,
    });

    return {
      content: addedComment.content,
      id: addedComment.id,
      owner: decoded.id,
    };
  }

  /**
   * @param {AddCommentUseCasePayload} payload
   * @private
   */
  _verifyPayload(payload) {
    if (!payload) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { accessToken, threadId, content } = payload;

    // Auth required
    if (!accessToken) {
      throw new Error("ADD_COMMENT.AUTHENTICATION_NOT_FOUND");
    }

    // Required fields
    if (!threadId || !content) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Type checking
    if (
      typeof accessToken !== "string" ||
      typeof threadId !== "string" ||
      typeof content !== "string"
    ) {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddCommentUseCase;

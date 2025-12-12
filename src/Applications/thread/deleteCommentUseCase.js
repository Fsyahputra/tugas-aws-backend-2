const InvariantError = require("../../Commons/exceptions/InvariantError");
const CommentRepository = require("../../Domains/comment/commentRepository");
const DeleteComment = require("../../Domains/comment/entities/deleteComment");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const UserRepository = require("../../Domains/users/UserRepository");
const AuthenticationTokenManager = require("../security/AuthenticationTokenManager");

/**
 * @typedef {object} DeleteCommentUseCasePayload
 * @property {string} threadId
 * @property {string}  accessToken
 * @property {string} commentId
 */
class DeleteCommentUseCase {
  /**
   * @param {CommentRepository} crp
   * @param {ThreadRepository} thrp
   * @param {AuthenticationTokenManager} tm
   * @param {UserRepository} usrp
   */
  constructor(tm, usrp, crp, thrp) {
    this._tm = tm;
    this._usrp = usrp;
    this._crp = crp;
    this._thrp = thrp;
  }
  /**
   * @param {DeleteCommentUseCasePayload} payload
   * @public
   */
  async execute(payload) {
    this._verifyPayload(payload);
    const { accessToken, commentId, threadId } = payload;
    const decoded = await this._tm.decodePayload(accessToken);
    await this._usrp.mustExistOrThrowById(decoded.id);
    await this._thrp.mustExistOrThrowId(threadId);
    await this._crp.mustExistOrThrowId(commentId);
    const addedComment = await this._crp.getByCommentId(commentId);
    const comment = new DeleteComment({
      is_deleted: addedComment.isDeleted,
      ownerId: addedComment.owner,
    });
    comment.deleteComment(decoded.id);
    await this._crp.delete(commentId);
  }

  /**
   * @param {DeleteCommentUseCasePayload} payload
   * @private
   */
  _verifyPayload(payload) {
    if (!payload) {
      throw new Error("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { accessToken, commentId, threadId } = payload;

    if (!accessToken) {
      throw new Error("DELETE_COMMENT.AUTHENTICATION_NOT_FOUND");
    }

    if (!commentId || !threadId) {
      throw new Error("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof accessToken !== "string" ||
      typeof commentId !== "string" ||
      typeof threadId !== "string"
    ) {
      throw new Error("DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteCommentUseCase;

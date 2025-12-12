const InvariantError = require("../../Commons/exceptions/InvariantError");
const CommentRepository = require("../../Domains/comment/commentRepository");
const DeleteReplies = require("../../Domains/replies/entities/deleteReplies");
const ReplyRepository = require("../../Domains/replies/replyRepository");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const UserRepository = require("../../Domains/users/UserRepository");
const AuthenticationTokenManager = require("../security/AuthenticationTokenManager");

/**
 * @typedef {object} DeleteReplyUseCasePayload
 * @property {string} threadId
 * @property {string} commentId
 * @property {string} replyId
 * @property {string} accessToken
 */

class DeleteReplyUseCase {
  /**
   * @param {UserRepository} usrp
   * @param {AuthenticationTokenManager} tm
   * @param {CommentRepository} crp
   * @param {ThreadRepository} thrp
   * @param {ReplyRepository} rpyrp
   */
  constructor(usrp, thrp, crp, rpyrp, tm) {
    this._usrp = usrp;
    this._thrp = thrp;
    this._crp = crp;
    this._rpyrp = rpyrp;
    this._tm = tm;
  }

  /**
   * @param {DeleteReplyUseCasePayload} payload
   * @public
   * @returns {Promise<void>}
   */
  async execute(payload) {
    const { accessToken, commentId, replyId, threadId } = payload;
    const decoded = await this._tm.decodePayload(accessToken);
    await this._thrp.mustExistOrThrowId(threadId);
    await this._crp.mustExistOrThrowId(commentId);
    await this._usrp.mustExistOrThrowById(decoded.id);
    await this._rpyrp.mustExistOrThrowId(replyId);
    const addedReply = await this._rpyrp.getById(replyId);
    const deleteReply = new DeleteReplies({
      isDeleted: addedReply.isDelete,
      ownerId: addedReply.owner,
    });
    deleteReply.deleteReplies(decoded.id);
    await this._rpyrp.del(replyId);
  }

  /**
   * @param {DeleteReplyUseCasePayload} payload
   * @private
   * @private
   */
  _verifyPayload(payload) {
    if (!payload) {
      throw new Error("DELETE_REPLY.PAYLOAD_NOT_PROVIDED");
    }

    const requiredKeys = ["accessToken", "threadId", "commentId", "replyId"];

    for (const key of requiredKeys) {
      if (!payload[key]) {
        throw new Error(`DELETE_REPLY.MISSING_${key.toUpperCase()}`);
      }
      if (typeof payload[key] !== "string") {
        throw new Error(`DELETE_REPLY.${key.toUpperCase()}_NOT_STRING`);
      }
    }
  }
}

module.exports = DeleteReplyUseCase;

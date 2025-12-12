const AddedReplies = require("./entities/addedReplies");

/**
 * @typedef {object} AddReplyPayload
 * @property {string} content
 * @property {string} owner
 * @property {string} threadId
 * @property {string} commentId
 */
class ReplyRepository {
  /**
   * @param {string} _
   */
  async mustExistOrThrowId(_) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {AddReplyPayload} _
   * @returns {Promise<AddedReplies>}
   */
  async add(_) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} _
   * @returns {Promise<AddedReplies>}
   */
  async getById(_) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} _
   * @returns {Promise<AddedReplies[]>}
   */
  async getByCommentId(_) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} _
   * @returns {Promise<void>}
   */
  async del(_) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;

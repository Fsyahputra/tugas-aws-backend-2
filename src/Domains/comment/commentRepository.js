const AddedComment = require("./entities/addedComment");
/**
 * @typedef {object} AddPayload
 * @property {string} owner
 * @property {string} username
 * @property {string} threadId
 * @property {string} content
 */
class CommentRepository {
  /**
   * @param {AddPayload} payload
   * @returns {Promise<AddedComment>}
   */
  async add(payload) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async mustExistOrThrowId(id) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} threadId
   * @returns {Promise<AddedComment[]>}
   */
  async getByThreadId(threadId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} commentId
   * @returns {Promise<AddedComment>}
   */
  async getByCommentId(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;

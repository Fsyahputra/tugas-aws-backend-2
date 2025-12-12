/**
 * @class
 * @property {string} ownerId
 * @property {boolean} isDeleted
 */
class DeleteComment {
  /**
   * @param {import("./type").DeleteCommentPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { ownerId, is_deleted } = payload;
    this.ownerId = ownerId;
    this.isDeleted = is_deleted;
  }

  /**
   * @private
   * @param {import("./type").DeleteCommentPayload} payload
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("DELETE_COMMENT.NOT_OBJECT");
    }

    /** @type {(keyof import('./type').DeleteCommentPayload)[]} */
    const required = ["ownerId", "is_deleted"];

    for (const key of required) {
      const value = payload[key];

      if (value === undefined || value === null) {
        throw new Error(`DELETE_COMMENT.MISSING_${key.toUpperCase()}`);
      }

      switch (key) {
        case "ownerId":
          if (typeof value !== "string") {
            throw new Error("DELETE_COMMENT.OWNERID_NOT_STRING");
          }
          break;

        case "is_deleted":
          if (typeof value !== "boolean") {
            throw new Error("DELETE_COMMENT.IS_DELETED_NOT_BOOLEAN");
          }
          break;
      }
    }
  }

  /**
   * @param {string} userId
   * @returns {void}
   */
  deleteComment(userId) {
    if (this.isDeleted) {
      throw new Error("DELETE_COMMENT_ENTITIES.COMMENT_ALREADY_DELETED");
    }

    if (userId !== this.ownerId) {
      throw new Error("DELETE_COMMENT_ENTITIES.ONLY_OWNER_CAN_DELETE_COMMENT");
    }
  }
}

module.exports = DeleteComment;

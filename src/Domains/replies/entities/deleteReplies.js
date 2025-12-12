/**
 * @typedef {object} DeleteRepliesPayload
 * @property {string} ownerId
 * @property {boolean} isDeleted
 */
class DeleteReplies {
  /**
   * @param {DeleteRepliesPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    this._ownerId = payload.ownerId;
    this._isDeleted = payload.isDeleted;
  }

  /**
   * @param {DeleteRepliesPayload} payload
   * @private
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("DELETE_REPLIES.NOT_OBJECT");
    }

    /** @type {(keyof DeleteRepliesPayload)[]} */
    const required = ["ownerId", "isDeleted"];
    for (const key of required) {
      if (payload[key] === undefined || payload[key] === null) {
        throw new Error(`DELETE_REPLIES.MISSING_${key.toUpperCase()}`);
      }

      if (key === "ownerId" && typeof payload[key] !== "string") {
        throw new Error("DELETE_REPLIES.OWNERID_NOT_STRING");
      }

      if (key === "isDeleted" && typeof payload[key] !== "boolean") {
        throw new Error("DELETE_REPLIES.ISDELETED_NOT_BOOLEAN");
      }
    }
  }

  /**
   * @param {string} userId
   * @returns {void}
   */
  deleteReplies(userId) {
    if (this._isDeleted) {
      throw new Error("DELETE_REPLIES_ENTITIES.REPLIES_ALREADY_DELETED");
    }

    if (userId !== this._ownerId) {
      throw new Error("DELETE_REPLIES_ENTITIES.ONLY_OWNER_CAN_DELETE_REPLY");
    }
  }
}

module.exports = DeleteReplies;

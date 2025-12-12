const AuthenticationError = require("./AuthenticationError");
const AuthorizationError = require("./AuthorizationError");
const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  /**
   * @type {Record<string, Error>}
   */
  _directories: {
    "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada",
    ),
    "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "tidak dapat membuat user baru karena tipe data tidak sesuai",
    ),
    "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
      "tidak dapat membuat user baru karena karakter username melebihi batas limit",
    ),
    "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
      "tidak dapat membuat user baru karena username mengandung karakter terlarang",
    ),
    "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "harus mengirimkan username dan password",
    ),
    "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "username dan password harus string",
    ),
    "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
      new InvariantError("harus mengirimkan token refresh"),
    "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
      new InvariantError("refresh token harus string"),
    "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
      new InvariantError("harus mengirimkan token refresh"),
    "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
      new InvariantError("refresh token harus string"),
    "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "accessToken, title, dan body harus ada",
    ),
    "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "accessToken, title, dan body harus berupa string",
    ),
    "ADD_THREAD.AUTHENTICATION_NOT_FOUND": new AuthenticationError(
      "Missing authentication",
    ),
    "DELETE_COMMENT.NOT_OBJECT": new InvariantError(
      "payload delete comment harus berupa objek",
    ),
    "DELETE_COMMENT.MISSING_OWNERID": new InvariantError(
      "payload delete comment harus memiliki ownerId",
    ),
    "DELETE_COMMENT.MISSING_IS_DELETED": new InvariantError(
      "payload delete comment harus memiliki is_deleted",
    ),
    "DELETE_COMMENT.OWNERID_NOT_STRING": new InvariantError(
      "ownerId harus berupa string",
    ),
    "DELETE_COMMENT.IS_DELETED_NOT_BOOLEAN": new InvariantError(
      "is_deleted harus berupa boolean",
    ),
    "DELETE_COMMENT_ENTITIES.COMMENT_ALREADY_DELETED": new InvariantError(
      "komentar sudah dihapus",
    ),
    "DELETE_COMMENT_ENTITIES.ONLY_OWNER_CAN_DELETE_COMMENT":
      new AuthorizationError(
        "hanya pemilik komentar yang dapat menghapus komentar",
      ),
    "REPLY_COMMENT.NOT_OBJECT": new InvariantError(
      "payload reply comment harus berupa objek",
    ),
    "REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "accessToken, content, threadId, dan commentId harus ada",
    ),
    "REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "accessToken, content, threadId, dan commentId harus berupa string",
    ),
    "NEW_REPLIES.MISSING_CONTENT": new InvariantError(
      "payload new replies harus memiliki content",
    ),
    "NEW_REPLIES.MISSING_OWNER": new InvariantError(
      "payload new replies harus memiliki owner",
    ),
    "NEW_REPLIES.MISSING_COMMENT_ID": new InvariantError(
      "payload new replies harus memiliki comment_id",
    ),
    "NEW_REPLIES.MISSING_THREAD_ID": new InvariantError(
      "payload new replies harus memiliki thread_id",
    ),

    "NEW_REPLIES.CONTENT_NOT_STRING": new InvariantError(
      "content pada new replies harus berupa string",
    ),
    "NEW_REPLIES.OWNER_NOT_STRING": new InvariantError(
      "owner pada new replies harus berupa string",
    ),
    "NEW_REPLIES.COMMENT_ID_NOT_STRING": new InvariantError(
      "comment_id pada new replies harus berupa string",
    ),
    "NEW_REPLIES.THREAD_ID_NOT_STRING": new InvariantError(
      "thread_id pada new replies harus berupa string",
    ),
    // DELETE_REPLY
    "DELETE_REPLY.PAYLOAD_NOT_PROVIDED": new InvariantError(
      "payload delete reply harus diberikan",
    ),

    "DELETE_REPLY.MISSING_ACCESSTOKEN": new InvariantError(
      "payload delete reply harus memiliki accessToken",
    ),
    "DELETE_REPLY.MISSING_THREADID": new InvariantError(
      "payload delete reply harus memiliki threadId",
    ),
    "DELETE_REPLY.MISSING_COMMENTID": new InvariantError(
      "payload delete reply harus memiliki commentId",
    ),
    "DELETE_REPLY.MISSING_REPLYID": new InvariantError(
      "payload delete reply harus memiliki replyId",
    ),

    "DELETE_REPLY.ACCESSTOKEN_NOT_STRING": new InvariantError(
      "accessToken pada delete reply harus berupa string",
    ),
    "DELETE_REPLY.THREADID_NOT_STRING": new InvariantError(
      "threadId pada delete reply harus berupa string",
    ),
    "DELETE_REPLY.COMMENTID_NOT_STRING": new InvariantError(
      "commentId pada delete reply harus berupa string",
    ),
    "DELETE_REPLY.REPLYID_NOT_STRING": new InvariantError(
      "replyId pada delete reply harus berupa string",
    ),

    // DELETE_REPLIES
    "DELETE_REPLIES.NOT_OBJECT": new InvariantError(
      "payload delete reply harus berupa objek",
    ),
    "DELETE_REPLIES.MISSING_OWNERID": new InvariantError(
      "payload delete reply harus memiliki ownerId",
    ),
    "DELETE_REPLIES.MISSING_ISDELETED": new InvariantError(
      "payload delete reply harus memiliki isDeleted",
    ),
    "DELETE_REPLIES.OWNERID_NOT_STRING": new InvariantError(
      "ownerId pada delete reply harus berupa string",
    ),
    "DELETE_REPLIES.ISDELETED_NOT_BOOLEAN": new InvariantError(
      "isDeleted pada delete reply harus berupa boolean",
    ),

    // DELETE_REPLIES_ENTITIES
    "DELETE_REPLIES_ENTITIES.REPLIES_ALREADY_DELETED": new InvariantError(
      "balasan sudah dihapus",
    ),
    "DELETE_REPLIES_ENTITIES.ONLY_OWNER_CAN_DELETE_REPLY":
      new AuthorizationError(
        "hanya pemilik balasan yang dapat menghapus balasan",
      ),
    // ADD_COMMENT
    "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "accessToken, threadId, dan content harus ada",
    ),
    "ADD_COMMENT.AUTHENTICATION_NOT_FOUND": new AuthenticationError(
      "Missing authentication",
    ),
    "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "accessToken, threadId, dan content harus berupa string",
    ),
    "DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "accessToken, commentId, dan threadId harus ada",
    ),
    "DELETE_COMMENT.AUTHENTICATION_NOT_FOUND": new AuthenticationError(
      "Missing authentication",
    ),
    "DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "accessToken, commentId, dan threadId harus berupa string",
    ),
    "DELETE_COMMENT.ONLY_OWNER_CAN_DELETE_COMMENT": new AuthorizationError(
      "hanya pemilik komentar yang dapat menghapus komentar",
    ),
    "DELETE_COMMENT.COMMENT_ALREADY_DELETED": new InvariantError(
      "komentar sudah dihapus",
    ),
    "REPLY_COMMENT.AUTHENTICATION_NOT_FOUND": new AuthenticationError(
      "Missing authentication",
    ),
  },
  /**
   * @param {Error} error
   * @returns {Error}
   */
  translate(error) {
    return this._directories[error.message] || error;
  },
};

module.exports = DomainErrorTranslator;

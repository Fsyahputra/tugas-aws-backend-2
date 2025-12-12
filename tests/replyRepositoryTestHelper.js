const { nanoid, customAlphabet } = require("nanoid");
const NewComment = require("../src/Domains/comment/entities/newComment");
const AddThread = require("../src/Domains/thread/entities/addThread");
const RegisterUser = require("../src/Domains/users/entities/RegisterUser");
const pool = require("../src/Infrastructures/database/postgres/pool");
const AddedReplies = require("../src/Domains/replies/entities/addedReplies");
const NewReplies = require("../src/Domains/replies/entities/newReplies");

/**
 * @typedef {object} addThreadRT
 * @property {AddThread} AddThread
 */

/**
 * @typedef {object} saveUserThreadAndCommentRT
 * @property {string} savedUserId
 * @property {string} savedThreadId
 * @property {string} savedCommentId
 */

/**
 * @param {string} id
 * @returns {Promise< AddedReplies >}
 */
async function getReplyById(id) {
  const getByIdQuery = {
    text: "select * from reply where id = $1",
    values: [id],
  };

  const res = await pool.query(getByIdQuery);

  return new AddedReplies({
    ...res.rows[0],
  });
}

/**
 * @param {Partial<import("../src/Domains/replies/entities/newReplies").NewRepliesPayload>|{}} [ovd={}]
 * @param {string} owner
 * @param {string} commentId
 * @param {string} threadId
 * @returns {NewReplies}
 */
function addReply(owner, commentId, threadId, ovd = {}) {
  return new NewReplies({
    comment_id: commentId,
    content: "sebuah balasan",
    owner: owner,
    thread_id: threadId,
    ...ovd,
  });
}

/**
 * @param {NewReplies} payload
 * @returns {Promise< string >}
 */
async function saveReply(payload) {
  const { commentId, content, owner, threadId } = payload;
  const id = nanoid();

  const saveReplyQuery = {
    text: "insert into reply (id, owner, content, is_delete, thread_id, comment_id) values($1, $2, $3, $4, $5, $6) returning id, owner, content, is_delete, thread_id",
    values: [id, owner, content, false, threadId, commentId],
  };

  const res = await pool.query(saveReplyQuery);
  return res.rows[0].id;
}

module.exports = {
  getReplyById,
  addReply,
  saveReply,
};

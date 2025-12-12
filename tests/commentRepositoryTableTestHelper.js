const { nanoid } = require("nanoid");
const AddedComment = require("../src/Domains/comment/entities/addedComment");
const NewComment = require("../src/Domains/comment/entities/newComment");
const pool = require("../src/Infrastructures/database/postgres/pool");

/**
 * @param {string} threadId
 * @param {Partial<import("../src/Domains/comment/entities/type").NewCommentPayload> | {}} ovd
 * @param {string} owner
 * @returns {NewComment}
 */
function addComment(threadId, owner, ovd = {}) {
  return new NewComment({
    content: "sebuah content",
    owner: owner,
    thread_id: threadId,
    ...ovd,
  });
}

/**
 * @param {NewComment} payload
 * @returns {Promise<string>}
 */
async function saveComment(payload) {
  const id = nanoid();

  const userUsername = {
    text: "select username from users where id = $1",
    values: [payload.owner],
  };

  const rest = await pool.query(userUsername);

  const saveCommentQuery = {
    text: "insert into comment (id, content, owner, username, thread_id, is_deleted) VALUES($1, $2, $3, $4, $5, $6) returning id",
    values: [
      id,
      payload.content,
      payload.owner,
      rest.rows[0].username,
      payload.threadId,
      false,
    ],
  };

  const res = await pool.query(saveCommentQuery);
  return res.rows[0].id;
}
/**
 * @param {string} id
 * @returns {Promise<AddedComment>}
 */
async function getCommentById(id) {
  /**
   * @type {import("pg").QueryConfig}
   */
  const getCommentByIdQuery = {
    text: "select * from comment where id = $1",
    values: [id],
  };

  const res = await pool.query(getCommentByIdQuery);
  return new AddedComment({
    ...res.rows[0],
  });
}

/**
 * @param {import("../src/Domains/comment/commentRepository").AddPayload} payload
 * @returns {Promise<string>}
 */
async function saveComment2(payload) {
  const { owner, username, content, threadId } = payload;
  const isDeleted = false;
  const id = nanoid();
  /**
   * @type {import("pg").QueryConfig}
   */
  const saveCommentQuery = {
    text: "insert into comment (id, content, owner, username, thread_id, is_deleted) values($1, $2, $3, $4, $5, $6) returning id, content, owner, username, thread_id",
    values: [id, content, owner, username, threadId, isDeleted],
  };
  const res = await pool.query(saveCommentQuery);
  return res.rows[0].id;
}

module.exports = {
  addComment,
  getCommentById,
  saveComment,
  saveComment2,
};

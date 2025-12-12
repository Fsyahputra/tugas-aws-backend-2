const { nanoid } = require("nanoid");
const AddedThread = require("../src/Domains/thread/entities/addedThread");
const AddThread = require("../src/Domains/thread/entities/addThread");
const RegisteredUser = require("../src/Domains/users/entities/RegisteredUser");
const RegisterUser = require("../src/Domains/users/entities/RegisterUser");
const pool = require("../src/Infrastructures/database/postgres/pool");

/**
 * @param {Partial<import("../src/Domains/thread/entities/addThread").AddThreadPayload>|{}} [ovd={}]
 * @param {string} owner
 */
function generateAddThreadPayload(owner, ovd = {}) {
  return new AddThread({
    body: "sebuah body",
    owner: owner,
    title: "sebuah title",
    ...ovd,
  });
}

/**
 * @param {string} id
 * @returns {Promise<AddedThread>}
 */
async function ThreadHelperGetThreadById(id) {
  /**
   * @type {import("pg").QueryConfig}
   */
  const query = {
    text: "select * from thread where id = $1",
    values: [id],
  };
  const res = await pool.query(query);
  return new AddedThread({
    ...res.rows[0],
  });
}

/**
 * @param {AddThread} payload
 * @returns {Promise<string>}
 */
async function saveThread(payload) {
  const id = nanoid();

  const saveThreadQuery = {
    text: "INSERT INTO thread (id, title, body, owner) VALUES($1, $2, $3, $4) returning id",
    values: [id, payload.title, payload.body, payload.owner],
  };

  const res = await pool.query(saveThreadQuery);
  return res.rows[0].id;
}

/**
 * @typedef {object} addThreadPayload
 * @property {Partial<import("../src/Domains/thread/entities/addThread").AddThreadPayload>| {}} AddThreadPayload
 */

/**
 * @param {addThreadPayload} payload
 * @param {string} owner
 * @returns {AddThread}
 */
function addThread(
  owner,
  payload = {
    AddThreadPayload: {},
  },
) {
  return new AddThread({
    body: "sebuah body",
    owner: owner,
    title: "sebuah title",
    ...payload.AddThreadPayload,
  });
}

module.exports = {
  generateAddThreadPayload,
  ThreadHelperGetThreadById,
  saveThread,
  addThread,
};

/* istanbul ignore file */
const { customAlphabet, nanoid } = require("nanoid");
const pool = require("../src/Infrastructures/database/postgres/pool");
const RegisterUser = require("../src/Domains/users/entities/RegisterUser");
const RegisteredUser = require("../src/Domains/users/entities/RegisteredUser");

const UsersTableTestHelper = {
  async addUser({
    id = "user-123",
    username = "dicoding",
    password = "secret",
    fullname = "Dicoding Indonesia",
  }) {
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4)",
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM users WHERE 1=1");
  },
};

// alphabet huruf+angka+underscore saja
const nanoidSafe = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_",
  10,
);

/**
 * @param {Partial<import("../src/Domains/thread/entities/addThread").AddThreadPayload> | {}} ovd
 * @returns {RegisterUser}
 */
function registerUser(ovd = {}) {
  return new RegisterUser({
    fullname: "fadhil",
    password: "passwordKuat",
    username: "Fadhil",
    ...ovd,
  });
}
/**
 * @param {Partial<import("../src/Domains/users/entities/RegisterUser").RegisterUserPayload>| {}} [ovd={}]
 * @returns {RegisterUser}
 */
function addUser(ovd = {}) {
  return new RegisterUser({
    fullname: "Muhammad Fadhil Syahputra",
    password: "password sangat kuat",
    username: nanoidSafe(), // pasti aman
    ...ovd,
  });
}

/**
 * Menambahkan user ke database secara langsung (untuk test)
 * @param {RegisterUser} registerUser
 * @returns {Promise< RegisteredUser >}
 */
async function UserHelperAddUser(registerUser) {
  const { username, password, fullname } = registerUser;
  const id = `user-${nanoid()}`;

  const query = {
    text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname",
    values: [id, username, password, fullname],
  };

  const result = await pool.query(query);

  return new RegisteredUser({ ...result.rows[0] });
}
/**
 * @param {RegisterUser} payload
 * @returns {Promise<string>}
 */
async function saveUser(payload) {
  const id = nanoid();

  const registerQuery = {
    text: "INSERT INTO users VALUES($1, $2, $3, $4) returning id, username, fullname ",
    values: [id, payload.username, payload.password, payload.fullname],
  };

  const res = await pool.query(registerQuery);
  return res.rows[0].id;
}
module.exports = {
  UsersTableTestHelper,
  addUser,
  saveUser,
  registerUser,
  UserHelperAddUser,
};

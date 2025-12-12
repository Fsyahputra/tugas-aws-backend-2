const RegisteredUser = require("./entities/RegisteredUser");
const RegisterUser = require("./entities/RegisterUser");

class UserRepository {
  /**
   * @param {RegisterUser} registerUser
   * @returns {Promise<RegisteredUser>}
   */
  async addUser(registerUser) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} username
   * @returns {Promise<void>}
   */
  async verifyAvailableUsername(username) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} username
   * @returns {Promise<string>}
   */
  async getPasswordByUsername(username) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} username
   * @returns {Promise<string>}
   */
  async getIdByUsername(username) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id
   */
  async mustExistOrThrowById(id) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id
   * @returns {Promise<RegisteredUser>}
   */
  async getUserById(id) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = UserRepository;

class PasswordHash {
  /**
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    throw new Error("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} plain
   * @param {string} encrypted
   * @returns {Promise<void>}
   */
  async comparePassword(plain, encrypted) {
    throw new Error("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = PasswordHash;

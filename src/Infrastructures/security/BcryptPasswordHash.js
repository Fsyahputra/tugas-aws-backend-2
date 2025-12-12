const EncryptionHelper = require("../../Applications/security/PasswordHash");
const AuthenticationError = require("../../Commons/exceptions/AuthenticationError");
const bcrypt = require("bcrypt");
class BcryptPasswordHash extends EncryptionHelper {
  /**
   * @param {typeof bcrypt} bcrypt
   * @param {number} [saltRound=10]
   */
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  /**
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    return await this._bcrypt.hash(password, this._saltRound);
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {Promise<void>}
   */
  async comparePassword(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError("kredensial yang Anda masukkan salah");
    }
  }
}

module.exports = BcryptPasswordHash;

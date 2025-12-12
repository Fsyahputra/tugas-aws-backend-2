const AuthenticationTokenManager = require("../../Applications/security/AuthenticationTokenManager");
const AuthenticationError = require("../../Commons/exceptions/AuthenticationError");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const jwt = require("@hapi/jwt");
class JwtTokenManager extends AuthenticationTokenManager {
  /**
   * @param {typeof jwt.token} jwt
   */
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  /**
   * @param {import("../../Applications/security/AuthenticationTokenManager").CreateTokenPayload} payload
   * @returns {Promise<string>}
   */
  async createAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  /**
   * @param {import("../../Applications/security/AuthenticationTokenManager").CreateTokenPayload} payload
   * @returns {Promise<string>}
   */
  async createRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  /**
   * @param {string} token
   * @returns {Promise<void>}
   */
  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError("refresh token tidak valid");
    }
  }

  /**
   * @param {string} token
   * @returns {Promise<import("../../Applications/security/AuthenticationTokenManager").DecodedToken>}
   */
  async decodePayload(token) {
    try {
      const artifacts = this._jwt.decode(token);
      // @ts-expect-error
      return artifacts.decoded.payload;
    } catch (error) {
      throw new AuthenticationError("akses token tidak valid");
    }
  }
}

module.exports = JwtTokenManager;

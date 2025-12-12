const ClientError = require("./ClientError");

class InvariantError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "InvariantError";
  }
}

module.exports = InvariantError;

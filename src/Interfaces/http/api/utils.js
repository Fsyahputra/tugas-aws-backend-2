/**
 * @param {import("@hapi/hapi").Request} request
 *
 */

function getTokenFromRequest(request) {
  const header = request.headers.authorization;
  if (!header) return null;

  const [type, token] = header.split(" ");
  if (type !== "Bearer") return null;

  return token;
}

module.exports = getTokenFromRequest;

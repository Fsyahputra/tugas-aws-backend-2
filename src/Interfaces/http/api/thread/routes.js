const ThreadHandler = require("./handler");

/**
 * @param {ThreadHandler} handler
 * @returns {import("@hapi/hapi").ServerRoute[]}
 */
function ThreadRoutes(handler) {
  return [
    {
      method: "POST",
      path: "/threads",
      handler: handler.postAddThread,
    },
    {
      method: "POST",
      path: "/threads/{threadId}/comments",
      handler: handler.postAddComment,
    },
    {
      method: "DELETE",
      path: "/threads/{threadId}/comments/{commentId}",
      handler: handler.deleteComment,
    },
    {
      method: "GET",
      path: "/threads/{threadId}",
      handler: handler.getDetailThread,
    },
  ];
}

module.exports = ThreadRoutes;

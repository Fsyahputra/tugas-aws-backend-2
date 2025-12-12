const ReplyHandler = require("./handler");

/**
 * @param {ReplyHandler} handler
 * @returns {import("@hapi/hapi").ServerRoute[]}
 */

function ReplyRoutes(handler) {
  return [
    {
      method: "POST",
      path: "/threads/{threadId}/comments/{commentId}/replies",
      handler: handler.postNewReply,
    },
    {
      method: "DELETE",
      path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
      handler: handler.deleteReply,
    },
  ];
}

module.exports = ReplyRoutes;

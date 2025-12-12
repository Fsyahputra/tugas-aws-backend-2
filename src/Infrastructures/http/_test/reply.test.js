const createServer = require("../createServer");
const container = require("../../container");
const pool = require("../../database/postgres/pool");

describe("/threads/{threadId}/comments/{commentId}/replies", () => {
  beforeEach(async () => {
    /**
     * @type {import("pg").QueryConfig}
     */
    const cleanUsersQuery = {
      text: "DELETE FROM users",
    };

    const cleanThreadsQuery = {
      text: "DELETE FROM thread",
    };

    const cleanCommentsQuery = {
      text: "DELETE FROM comment",
    };

    await pool.query(cleanCommentsQuery);
    await pool.query(cleanThreadsQuery);
    await pool.query(cleanUsersQuery);
  });

  afterAll(async () => {
    /**
     * @type {import("pg").QueryConfig}
     */
    const cleanUsersQuery = {
      text: "DELETE FROM users",
    };

    const cleanThreadsQuery = {
      text: "DELETE FROM thread",
    };

    const cleanCommentsQuery = {
      text: "DELETE FROM comment",
    };

    await pool.query(cleanCommentsQuery);
    await pool.query(cleanThreadsQuery);
    await pool.query(cleanUsersQuery);
    await pool.end();
  });
  /**
   * Register + Login user → return access token
   * @param {import("@hapi/hapi").Server} server
   * @param {string} username
   * @returns {Promise<string>} accessToken
   */

  const registerUser = async (server, username) => {
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username,
        password: "secret",
        fullname: `${username} fullname`,
      },
    });

    const login = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: { username, password: "secret" },
    });

    return JSON.parse(login.payload).data.accessToken;
  };

  /**
   * Create a thread
   * @param {import("@hapi/hapi").Server} server
   * @param {string} token
   * @returns {Promise<string>} threadId
   */
  const createThread = async (server, token) => {
    const res = await server.inject({
      method: "POST",
      url: "/threads",
      headers: { Authorization: `Bearer ${token}` },
      payload: { title: "judul", body: "isi" },
    });

    return JSON.parse(res.payload).data.addedThread.id;
  };

  /**
   * Create a comment
   * @param {import("@hapi/hapi").Server} server
   * @param {string} token
   * @param {string} threadId
   * @returns {Promise<string>} commentId
   */
  const createComment = async (server, token, threadId) => {
    const res = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments`,
      headers: { Authorization: `Bearer ${token}` },
      payload: { content: "komentar" },
    });
    return JSON.parse(res.payload).data.addedComment.id;
  };

  /**
   * Create reply for a comment
   * @param {import("@hapi/hapi").Server} server
   * @param {string} token
   * @param {string} threadId
   * @param {string} commentId
   * @returns {Promise<string>} replyId
   */
  const createReply = async (server, token, threadId, commentId) => {
    const res = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      headers: { Authorization: `Bearer ${token}` },
      payload: { content: "balasan" },
    });

    return JSON.parse(res.payload).data.addedReply.id;
  };

  describe("POST reply", () => {
    it("should respond 201 and return added reply", async () => {
      const server = await createServer(container);
      const token = await registerUser(server, "user1");
      const threadId = await createThread(server, token);
      const commentId = await createComment(server, token, threadId);

      const res = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: { Authorization: `Bearer ${token}` },
        payload: { content: "balasan" },
      });

      const json = JSON.parse(res.payload);

      expect(res.statusCode).toBe(201);
      expect(json.status).toBe("success");
      expect(json.data.addedReply).toBeDefined();
      expect(json.data.addedReply.content).toBe("balasan");
    });

    it("should respond 400 if payload invalid", async () => {
      const server = await createServer(container);
      const token = await registerUser(server, "user1");
      const threadId = await createThread(server, token);
      const commentId = await createComment(server, token, threadId);

      const res = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: { Authorization: `Bearer ${token}` },
        payload: {},
      });

      expect(res.statusCode).toBe(400);
    });

    it("should respond 404 if thread or comment not found", async () => {
      const server = await createServer(container);
      const token = await registerUser(server, "user1");

      const res = await server.inject({
        method: "POST",
        url: `/threads/xxx/comments/yyy/replies`,
        headers: { Authorization: `Bearer ${token}` },
        payload: { content: "balasan" },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE reply", () => {
    it("should respond 200 when reply deleted", async () => {
      const server = await createServer(container);
      const token = await registerUser(server, "user1");

      const threadId = await createThread(server, token);
      const commentId = await createComment(server, token, threadId);
      const replyId = await createReply(server, token, threadId, commentId);

      const res = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).status).toBe("success");
    });

    it("should respond 403 when deleting reply not owned", async () => {
      const server = await createServer(container);

      const tokenA = await registerUser(server, "userA");
      const tokenB = await registerUser(server, "userB");

      const threadId = await createThread(server, tokenA);
      const commentId = await createComment(server, tokenA, threadId);
      const replyId = await createReply(server, tokenA, threadId, commentId);

      const res = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${tokenB}` },
      });

      expect(res.statusCode).toBe(403);
    });

    it("should respond 404 when reply not found", async () => {
      const server = await createServer(container);
      const token = await registerUser(server, "user1");

      const threadId = await createThread(server, token);
      const commentId = await createComment(server, token, threadId);

      const res = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("GET thread should show replies ascending + deleted text", () => {
    it("should show replies sorted & deleted reply replaced with '**balasan telah dihapus**'", async () => {
      const server = await createServer(container);
      const token = await registerUser(server, "user1");

      const threadId = await createThread(server, token);
      const commentId = await createComment(server, token, threadId);

      const reply1 = await createReply(server, token, threadId, commentId);
      const reply2 = await createReply(server, token, threadId, commentId);

      // delete reply1
      await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${reply1}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const json = JSON.parse(res.payload);
      const replies = json.data.thread.comments[0].replies;

      expect(replies.length).toBe(2);

      expect(replies[0].content).toBe("**balasan telah dihapus**");
      expect(replies[1].content).toBe("balasan");

      expect(new Date(replies[0].date) < new Date(replies[1].date)).toBe(true);
    });
  });
});

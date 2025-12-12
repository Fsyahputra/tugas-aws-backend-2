const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
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

  describe("POST /threads", () => {
    it("should response 201 and add thread", async () => {
      // Arrange
      const server = await createServer(container);

      // register + login
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "judul thread",
          body: "isi thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toBe("success");
      expect(responseJson.data.addedThread.id).toBeDefined();
    });

    it("should response 400 if payload missing", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });
      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: { title: "judul" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toBe("fail");
    });

    it("should response 401 if token missing", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: { title: "judul", body: "isi" },
      });

      expect(response.statusCode).toEqual(401);
    });
  });

  describe("GET /threads/{threadId}", () => {
    it("should response 200 and return thread detail", async () => {
      const server = await createServer(container);

      // register + login
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      const addThread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: { title: "judul", body: "isi" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThread.payload);

      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toBe("success");
      expect(responseJson.data.thread).toBeDefined();
    });

    it("should return 404 when thread not found", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "GET",
        url: "/threads/xxx",
      });
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("POST /threads/{threadId}/comments", () => {
    it("should response 201 and add comment", async () => {
      const server = await createServer(container);

      // add user + login
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      // add thread
      const threadResp = await server.inject({
        method: "POST",
        url: "/threads",
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { title: "judul", body: "isi" },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(threadResp.payload);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { content: "komentar" },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toBe("success");
      expect(responseJson.data.addedComment.id).toBeDefined();
    });

    it("should response 404 if thread not found", async () => {
      const server = await createServer(container);

      // add user + login
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      const response = await server.inject({
        method: "POST",
        url: "/threads/xxx/comments",
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { content: "halo" },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 when comment deleted", async () => {
      const server = await createServer(container);

      // add user + login
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      // add thread
      const threadResp = await server.inject({
        method: "POST",
        url: "/threads",
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { title: "judul", body: "isi" },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(threadResp.payload);

      // add comment
      const commentResp = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { content: "komentar" },
      });

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(commentResp.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toBe("success");
    });

    it("should return 403 when not the owner tries to delete the comment", async () => {
      const server = await createServer(container);

      // user A
      await server.inject({
        method: "POST",
        url: "/users",
        payload: { username: "userA", password: "secret", fullname: "User A" },
      });

      const loginA = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "userA", password: "secret" },
      });

      const {
        data: { accessToken: accessA },
      } = JSON.parse(loginA.payload);

      // user B
      await server.inject({
        method: "POST",
        url: "/users",
        payload: { username: "userB", password: "secret", fullname: "User B" },
      });

      const loginB = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "userB", password: "secret" },
      });

      const {
        data: { accessToken: accessB },
      } = JSON.parse(loginB.payload);

      // A create thread
      const threadResp = await server.inject({
        method: "POST",
        url: "/threads",
        headers: { Authorization: `Bearer ${accessA}` },
        payload: { title: "judul", body: "isi" },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(threadResp.payload);

      // A add comment
      const commentResp = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        headers: { Authorization: `Bearer ${accessA}` },
        payload: { content: "komentar user A" },
      });

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(commentResp.payload);

      // B tries to delete comment A
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessB}` },
      });

      expect(response.statusCode).toBe(403);

      const json = JSON.parse(response.payload);
      expect(json.status).toBe("fail");
    });

    it("should return 404 when thread does not exist", async () => {
      const server = await createServer(container);

      // user login
      await server.inject({
        method: "POST",
        url: "/users",
        payload: { username: "coba", password: "secret", fullname: "Coba" },
      });

      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "coba", password: "secret" },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      // try delete on non existing thread
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-xxx/comments/comment-123`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toBe(404);

      const json = JSON.parse(response.payload);
      expect(json.status).toBe("fail");
    });

    it("should return 404 when comment does not exist", async () => {
      const server = await createServer(container);

      // add user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: { username: "halo", password: "secret", fullname: "Halo" },
      });

      const login = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "halo", password: "secret" },
      });

      const {
        data: { accessToken },
      } = JSON.parse(login.payload);

      // add thread
      const threadResp = await server.inject({
        method: "POST",
        url: "/threads",
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { title: "judul", body: "isi" },
      });

      const {
        data: { id: threadId },
      } = JSON.parse(threadResp.payload);

      // try delete non-existing comment
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/comment-xxx`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toBe(404);

      const json = JSON.parse(response.payload);
      expect(json.status).toBe("fail");
    });
  });

  it("should set title and body to empty string when payload is empty", async () => {
    const server = await createServer(container);

    // register + login
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding2",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });

    const login = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "dicoding2",
        password: "secret",
      },
    });

    const {
      data: { accessToken },
    } = JSON.parse(login.payload);

    // kirim payload kosong → harus melalui line 30
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: {},
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Expect: useCase bakal gagal karena title/body = ""
    expect(response.statusCode).toBe(400);

    const json = JSON.parse(response.payload);
    expect(json.status).toBe("fail");
  });
});

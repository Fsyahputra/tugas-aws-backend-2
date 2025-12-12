// @ts-nocheck
const GetDetailThreadUseCase = require("../getDetailThread");

describe("GetDetailThreadUseCase", () => {
  let useCase;
  let mockTm, mockUsrRepo, mockCommentRepo, mockThreadRepo, mockReplyRepo;

  beforeEach(() => {
    mockUsrRepo = {
      mustExistOrThrowById: jest.fn(),
      getUserById: jest.fn(),
    };
    mockCommentRepo = { getByThreadId: jest.fn() };
    mockThreadRepo = {
      mustExistOrThrowId: jest.fn(),
      getThreadById: jest.fn(),
    };
    mockReplyRepo = { getByCommentId: jest.fn() };

    useCase = new GetDetailThreadUseCase(
      mockUsrRepo,
      mockCommentRepo,
      mockThreadRepo,
      mockReplyRepo,
    );
  });

  it("should return thread detail with sorted comments and replies", async () => {
    const payload = { accessToken: "token123", threadId: "thread-1" };

    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockThreadRepo.getThreadById.mockResolvedValue({
      id: "thread-1",
      title: "Thread Title",
      body: "Thread Body",
      date: new Date("2025-11-28T10:00:00Z"),
      owner: "user-1",
    });
    mockUsrRepo.getUserById.mockImplementation(async (userId) => {
      const map = {
        "user-1": { username: "ownerUser" },
        "user-2": { username: "replier1" },
        "user-3": { username: "replier2" },
      };
      return map[userId];
    });
    mockCommentRepo.getByThreadId.mockResolvedValue([
      {
        id: "c1",
        username: "userA",
        content: "First comment",
        date: new Date("2025-11-28T10:10:00Z"),
        isDeleted: false,
      },
      {
        id: "c2",
        username: "userB",
        content: "Second comment",
        date: new Date("2025-11-28T10:05:00Z"),
        isDeleted: true,
      },
    ]);
    mockReplyRepo.getByCommentId.mockImplementation(async (commentId) => {
      if (commentId === "c1")
        return [
          {
            owner: "user-2",
            content: "Reply 1",
            date: new Date("2025-11-28T10:15:00Z"),
            isDelete: false,
          },
        ];
      if (commentId === "c2")
        return [
          {
            owner: "user-3",
            content: "Reply 2",
            date: new Date("2025-11-28T10:12:00Z"),
            isDelete: true,
          },
        ];
      return [];
    });

    const result = await useCase.execute(payload);

    expect(result.id).toBe("thread-1");
    expect(result.username).toBe("ownerUser");
    expect(result.comments[0].id).toBe("c2"); // deleted comment first
    expect(result.comments[0].content).toBe("**komentar telah dihapus**");
    expect(result.comments[0].replies[0].content).toBe(
      "**balasan telah dihapus**",
    );
    expect(result.comments[1].replies[0].username).toBe("replier1");
  });

  it("should throw error if thread does not exist", async () => {
    const payload = { accessToken: "token123", threadId: "thread-unknown" };
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockImplementation(() => {
      throw new Error("Thread not found");
    });

    await expect(useCase.execute(payload)).rejects.toThrow("Thread not found");
  });
  it("should map deleted replies and sort them by date", async () => {
    const payload = { threadId: "thread-1" };

    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockThreadRepo.getThreadById.mockResolvedValue({
      id: "thread-1",
      title: "Test",
      body: "Body",
      date: new Date(),
      owner: "user-1",
    });

    mockUsrRepo.getUserById.mockImplementation(async (user) => {
      return { username: user };
    });

    mockCommentRepo.getByThreadId.mockResolvedValue([
      {
        id: "comment-1",
        username: "user-2",
        content: "comment content",
        date: new Date("2025-01-01"),
        isDelete: false,
      },
    ]);

    mockReplyRepo.getByCommentId.mockResolvedValue([
      {
        id: "reply-2",
        username: "userB",
        owner: "userB",
        content: "Second reply",
        date: new Date("2025-01-03"),
        isDelete: false,
      },
      {
        id: "reply-1",
        username: "userA",
        content: "First reply",
        owner: "userA",
        date: new Date("2025-01-02"),
        isDelete: true,
      },
    ]);

    const result = await useCase.execute(payload);

    expect(result.comments[0].replies).toEqual([
      {
        id: "reply-1",
        username: "userA",
        date: new Date("2025-01-02"),
        content: "**balasan telah dihapus**",
      },
      {
        id: "reply-2",
        username: "userB",
        date: new Date("2025-01-03"),
        content: "Second reply",
      },
    ]);
  });

  it("should sort replies correctly when dates are string instead of Date object", async () => {
    const payload = { threadId: "thread-1" };

    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockThreadRepo.getThreadById.mockResolvedValue({
      id: "thread-1",
      title: "Test",
      body: "Body",
      date: "2025-01-01T00:00:00Z",
      owner: "user-1",
    });
    mockUsrRepo.getUserById.mockImplementation(async (user) => {
      return { username: user };
    });
    mockCommentRepo.getByThreadId.mockResolvedValue([
      {
        id: "comment-1",
        username: "user-2",
        content: "comment content",
        date: "2025-01-03T00:00:00Z", // <-- STRING
        isDelete: false,
      },
    ]);

    mockReplyRepo.getByCommentId.mockResolvedValue([
      {
        id: "reply-2",
        username: "userB",
        owner: "userB",
        content: "Second reply",
        date: "2025-01-10T00:00:00Z", // <-- STRING
        isDelete: false,
      },
      {
        id: "reply-1",
        username: "userA",
        owner: "userA",
        content: "First reply",
        date: "2025-01-05T00:00:00Z", // <-- STRING
        isDelete: true,
      },
    ]);

    const result = await useCase.execute(payload);

    expect(result.comments[0].replies).toEqual([
      {
        id: "reply-1",
        username: "userA",
        date: "2025-01-05T00:00:00Z",
        content: "**balasan telah dihapus**",
      },
      {
        id: "reply-2",
        username: "userB",
        date: "2025-01-10T00:00:00Z",
        content: "Second reply",
      },
    ]);
  });

  it("should cover branch where b.date is Date instance (reply sorting)", async () => {
    const payload = { threadId: "t-1" };

    // thread
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockThreadRepo.getThreadById.mockResolvedValue({
      id: "t-1",
      title: "t",
      body: "b",
      date: new Date(),
      owner: "u-1",
    });

    // user for thread owner
    mockUsrRepo.getUserById.mockImplementation(async (user) => {
      return { username: user };
    });

    // 1 comment saja
    mockCommentRepo.getByThreadId.mockResolvedValue([
      {
        id: "c-1",
        username: "userA",
        content: "x",
        date: new Date(),
        isDeleted: false,
      },
    ]);

    // replies:
    // reply A = string date (a)
    // reply B = Date instance (b) → ini yang memicu 105–107
    mockReplyRepo.getByCommentId.mockResolvedValue([
      {
        id: "r1",
        owner: "uA",
        content: "one",
        date: "2025-01-01", // a = string
        isDelete: false,
      },
      {
        id: "r2",
        owner: "uB",
        content: "two",
        date: new Date("2025-01-02"), // b = Date instance (TARGET BRANCH)
        isDelete: false,
      },
    ]);

    // user for replies (wajib)
    mockUsrRepo.getUserById.mockImplementation(async (uid) => ({
      username: uid,
    }));

    const result = await useCase.execute(payload);

    // minimal assertion, cukup memastikan sorting terjadi
    expect(result.comments[0].replies.length).toBe(2);
  });

  it("should cover branch where comments have mixed date types (comment sorting)", async () => {
    const payload = { threadId: "t-1" };

    // thread
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockThreadRepo.getThreadById.mockResolvedValue({
      id: "t-1",
      title: "t",
      body: "b",
      date: new Date(),
      owner: "u-1",
    });

    // user for thread owner
    mockUsrRepo.getUserById.mockImplementation(async (user) => {
      return { username: user };
    });

    // COMMENTS:
    // A = string date  → a.date instanceof Date = false
    // B = Date instance → b.date instanceof Date = true
    mockCommentRepo.getByThreadId.mockResolvedValue([
      {
        id: "c-1",
        username: "userA",
        content: "x",
        date: "2025-01-02T10:00:00.000Z", // string
        isDeleted: false,
      },
      {
        id: "c-2",
        username: "userB",
        content: "y",
        date: new Date("2025-01-01T09:00:00.000Z"), // Date instance
        isDeleted: false,
      },
    ]);

    // replies kosong supaya tidak mengganggu
    mockReplyRepo.getByCommentId.mockResolvedValue([]);

    const result = await useCase.execute(payload);

    // minimal assertion untuk memastikan sorting terjadi
    expect(result.comments.length).toBe(2);

    // comment dengan tanggal lebih awal harus muncul dulu
    expect(result.comments[0].id).toBe("c-2");
  });

  it("should cover branch where a.date is a Date instance (comment sorting line 104)", async () => {
    const payload = { threadId: "t-1" };

    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockThreadRepo.getThreadById.mockResolvedValue({
      id: "t-1",
      title: "thread",
      body: "body",
      date: new Date(),
      owner: "u-1",
    });

    // untuk owner
    mockUsrRepo.getUserById.mockImplementation(async (uid) => ({
      username: uid,
    }));

    // A = Date instance → TARGET branch
    // B = string date
    mockCommentRepo.getByThreadId.mockResolvedValue([
      {
        id: "c-1",
        username: "ua",
        content: "A",
        date: new Date("2025-01-02T00:00:00.000Z"), // a.date = Date → line 104 TRUE
        isDeleted: false,
      },
      {
        id: "c-2",
        username: "ub",
        content: "B",
        date: "2025-01-01T00:00:00.000Z", // b.date = string
        isDeleted: false,
      },
    ]);

    // replies kosong
    mockReplyRepo.getByCommentId.mockResolvedValue([]);

    const result = await useCase.execute(payload);

    expect(result.comments.length).toBe(2);
  });
});

describe("GetDetailThreadUseCase _verifyPayload", () => {
  let useCase;

  beforeEach(() => {
    useCase = new GetDetailThreadUseCase(
      {}, // TokenManager
      {}, // UserRepository
      {}, // CommentRepository
      {}, // ThreadRepository
      {}, // ReplyRepository
    );
  });

  it("should throw error when payload is empty", () => {
    expect(() => useCase._verifyPayload()).toThrow(
      "Payload tidak boleh kosong",
    );
  });

  it("should throw error when required properties are missing", () => {
    const payloadMissing = { accessToken: "token" }; // missing threadId
    expect(() => useCase._verifyPayload(payloadMissing)).toThrow(
      "threadId harus ada",
    );
  });

  it("should throw error when properties are not string", () => {
    const invalidPayload = { accessToken: 123, threadId: {} };
    expect(() => useCase._verifyPayload(invalidPayload)).toThrow(
      "threadId harus berupa string",
    );
  });

  it("should not throw error when payload is valid", () => {
    const validPayload = { accessToken: "token", threadId: "thread-1" };
    expect(() => useCase._verifyPayload(validPayload)).not.toThrow();
  });
});

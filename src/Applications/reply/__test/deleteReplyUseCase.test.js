// @ts-nocheck
const DeleteReplyUseCase = require("../deleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  let useCase;
  let mockTm, mockUsrRepo, mockCommentRepo, mockThreadRepo, mockReplyRepo;

  beforeEach(() => {
    mockTm = { decodePayload: jest.fn() };
    mockUsrRepo = { mustExistOrThrowById: jest.fn() };
    mockThreadRepo = { mustExistOrThrowId: jest.fn() };
    mockCommentRepo = { mustExistOrThrowId: jest.fn() };
    mockReplyRepo = {
      mustExistOrThrowId: jest.fn(),
      getById: jest.fn(),
      del: jest.fn(),
    };

    useCase = new DeleteReplyUseCase(
      mockUsrRepo,
      mockThreadRepo,
      mockCommentRepo,
      mockReplyRepo,
      mockTm,
    );
  });

  it("should delete a reply successfully", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-1",
      commentId: "comment-1",
      replyId: "reply-1",
    };

    mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockCommentRepo.mustExistOrThrowId.mockResolvedValue();
    mockReplyRepo.mustExistOrThrowId.mockResolvedValue();
    mockReplyRepo.getById.mockResolvedValue({
      id: "reply-1",
      isDelete: false,
      owner: "user-1",
    });
    mockReplyRepo.del.mockResolvedValue();

    await useCase.execute(payload);

    expect(mockTm.decodePayload).toHaveBeenCalledWith("token123");
    expect(mockUsrRepo.mustExistOrThrowById).toHaveBeenCalledWith("user-1");
    expect(mockThreadRepo.mustExistOrThrowId).toHaveBeenCalledWith("thread-1");
    expect(mockCommentRepo.mustExistOrThrowId).toHaveBeenCalledWith(
      "comment-1",
    );
    expect(mockReplyRepo.mustExistOrThrowId).toHaveBeenCalledWith("reply-1");
    expect(mockReplyRepo.del).toHaveBeenCalledWith("reply-1");
  });

  it("should throw error if user does not exist", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-1",
      commentId: "comment-1",
      replyId: "reply-1",
    };
    mockTm.decodePayload.mockResolvedValue({ id: "user-x" });
    mockUsrRepo.mustExistOrThrowById.mockImplementation(() => {
      throw new Error("User not found");
    });

    await expect(useCase.execute(payload)).rejects.toThrow("User not found");
  });

  it("should throw error if thread does not exist", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-x",
      commentId: "comment-1",
      replyId: "reply-1",
    };
    mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockImplementation(() => {
      throw new Error("Thread not found");
    });

    await expect(useCase.execute(payload)).rejects.toThrow("Thread not found");
  });

  it("should throw error if comment does not exist", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-1",
      commentId: "comment-x",
      replyId: "reply-1",
    };
    mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockCommentRepo.mustExistOrThrowId.mockImplementation(() => {
      throw new Error("Comment not found");
    });

    await expect(useCase.execute(payload)).rejects.toThrow("Comment not found");
  });

  it("should throw error if reply does not exist", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-1",
      commentId: "comment-1",
      replyId: "reply-x",
    };
    mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockCommentRepo.mustExistOrThrowId.mockResolvedValue();
    mockReplyRepo.mustExistOrThrowId.mockImplementation(() => {
      throw new Error("Reply not found");
    });

    await expect(useCase.execute(payload)).rejects.toThrow("Reply not found");
  });

  describe("_verifyPayload", () => {
    it("should throw error if payload is empty", () => {
      expect(() => useCase._verifyPayload(null)).toThrow();
    });

    it("should throw error if required fields are missing", () => {
      expect(() => useCase._verifyPayload({})).toThrow();
    });

    it("should throw error if fields are not strings", () => {
      expect(() =>
        useCase._verifyPayload({
          accessToken: 123,
          threadId: 1,
          commentId: 2,
          replyId: 3,
        }),
      ).toThrow();
    });

    it("should not throw error if payload is valid", () => {
      expect(() =>
        useCase._verifyPayload({
          accessToken: "token",
          threadId: "thread-1",
          commentId: "comment-1",
          replyId: "reply-1",
        }),
      ).not.toThrow();
    });
  });
});

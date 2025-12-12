// @ts-nocheck
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AddReplyUseCase = require("../addReplyUseCase");

describe("AddReplyUseCase", () => {
  let useCase;
  let mockTm, mockUsrRepo, mockCommentRepo, mockThreadRepo, mockReplyRepo;

  beforeEach(() => {
    mockTm = { decodePayload: jest.fn() };
    mockUsrRepo = { mustExistOrThrowById: jest.fn() };
    mockCommentRepo = { mustExistOrThrowId: jest.fn() };
    mockThreadRepo = { mustExistOrThrowId: jest.fn() };
    mockReplyRepo = { add: jest.fn() };

    useCase = new AddReplyUseCase(
      mockThreadRepo,
      mockUsrRepo,
      mockCommentRepo,
      mockTm,
      mockReplyRepo,
    );
  });

  describe("execute", () => {
    it("should add a reply successfully", async () => {
      const payload = {
        accessToken: "token123",
        content: "Reply content",
        threadId: "thread-1",
        commentId: "comment-1",
      };

      mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
      mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
      mockCommentRepo.mustExistOrThrowId.mockResolvedValue();
      mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
      mockReplyRepo.add.mockResolvedValue({
        id: "reply-1",
        content: payload.content,
        owner: "user-1",
      });

      await useCase.excute(payload);

      expect(mockTm.decodePayload).toHaveBeenCalledWith("token123");
      expect(mockUsrRepo.mustExistOrThrowById).toHaveBeenCalledWith("user-1");
      expect(mockCommentRepo.mustExistOrThrowId).toHaveBeenCalledWith(
        "comment-1",
      );
      expect(mockThreadRepo.mustExistOrThrowId).toHaveBeenCalledWith(
        "thread-1",
      );
      expect(mockReplyRepo.add).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "Reply content",
          owner: "user-1",
          threadId: "thread-1",
          commentId: "comment-1",
        }),
      );
    });

    it("should throw error if payload is invalid", async () => {
      const invalidPayload = {
        accessToken: "",
        content: "",
        threadId: "",
        commentId: "",
      };
      expect(() => useCase._verifyPayload(invalidPayload)).toThrow();
    });

    it("should throw error if token is invalid", async () => {
      const payload = {
        accessToken: "bad-token",
        content: "Reply content",
        threadId: "thread-1",
        commentId: "comment-1",
      };
      mockTm.decodePayload.mockRejectedValue(new Error("Invalid token"));

      await expect(useCase.excute(payload)).rejects.toThrow("Invalid token");
    });

    it("should throw error if user does not exist", async () => {
      const payload = {
        accessToken: "token123",
        content: "Reply content",
        threadId: "thread-1",
        commentId: "comment-1",
      };
      mockTm.decodePayload.mockResolvedValue({ id: "user-unknown" });
      mockUsrRepo.mustExistOrThrowById.mockRejectedValue(
        new Error("User not found"),
      );

      await expect(useCase.excute(payload)).rejects.toThrow("User not found");
    });

    it("should throw error if comment does not exist", async () => {
      const payload = {
        accessToken: "token123",
        content: "Reply content",
        threadId: "thread-1",
        commentId: "comment-unknown",
      };
      mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
      mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
      mockCommentRepo.mustExistOrThrowId.mockRejectedValue(
        new Error("Comment not found"),
      );

      await expect(useCase.excute(payload)).rejects.toThrow(
        "Comment not found",
      );
    });

    it("should throw error if thread does not exist", async () => {
      const payload = {
        accessToken: "token123",
        content: "Reply content",
        threadId: "thread-unknown",
        commentId: "comment-1",
      };
      mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
      mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
      mockCommentRepo.mustExistOrThrowId.mockResolvedValue();
      mockThreadRepo.mustExistOrThrowId.mockRejectedValue(
        new Error("Thread not found"),
      );

      await expect(useCase.excute(payload)).rejects.toThrow("Thread not found");
    });
  });

  describe("_verifyPayload", () => {
    it("should throw error when payload is empty", () => {
      expect(() => useCase._verifyPayload()).toThrow(Error);
    });

    it("should throw error when any property is missing", () => {
      const payload = { accessToken: "token", content: "text", threadId: "t1" };
      expect(() => useCase._verifyPayload(payload)).toThrow(Error);
    });

    it("should throw error when properties are not string", () => {
      const payload = {
        accessToken: 123,
        content: true,
        threadId: {},
        commentId: [],
      };
      expect(() => useCase._verifyPayload(payload)).toThrow(Error);
    });

    it("should not throw error when payload is valid", () => {
      const payload = {
        accessToken: "token",
        content: "text",
        threadId: "thread-1",
        commentId: "comment-1",
      };
      expect(() => useCase._verifyPayload(payload)).not.toThrow();
    });
  });
});

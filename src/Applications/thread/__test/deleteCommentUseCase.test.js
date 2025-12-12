// @ts-nocheck
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const DeleteCommentUseCase = require("../deleteCommentUseCase");

describe("deleteCommentUseCase", () => {
  let useCase;
  let mockTm, mockUsrRepo, mockCommentRepo, mockThreadRepo;

  beforeEach(() => {
    mockTm = { decodePayload: jest.fn() };

    mockUsrRepo = {
      mustExistOrThrowById: jest.fn(),
    };

    mockThreadRepo = {
      mustExistOrThrowId: jest.fn(),
    };

    mockCommentRepo = {
      mustExistOrThrowId: jest.fn(),
      getByCommentId: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteCommentUseCase(
      mockTm,
      mockUsrRepo,
      mockCommentRepo,
      mockThreadRepo,
    );
  });

  it("should delete a comment successfully", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-1",
      commentId: "comment-1",
    };

    mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockCommentRepo.mustExistOrThrowId.mockResolvedValue();

    mockCommentRepo.getByCommentId.mockResolvedValue({
      id: "comment-1",
      isDeleted: false,
      owner: "user-1",
    });

    await useCase.execute(payload);

    expect(mockTm.decodePayload).toHaveBeenCalledWith("token123");
    expect(mockUsrRepo.mustExistOrThrowById).toHaveBeenCalledWith("user-1");
    expect(mockThreadRepo.mustExistOrThrowId).toHaveBeenCalledWith("thread-1");
    expect(mockCommentRepo.mustExistOrThrowId).toHaveBeenCalledWith(
      "comment-1",
    );
    expect(mockCommentRepo.delete).toHaveBeenCalledWith("comment-1");
  });

  it("should throw error if user does not exist", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-1",
      commentId: "c1",
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
      commentId: "c1",
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
    };

    mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();

    mockCommentRepo.mustExistOrThrowId.mockImplementation(() => {
      throw new Error("Comment not found");
    });

    await expect(useCase.execute(payload)).rejects.toThrow("Comment not found");
  });

  it("should throw error if user is not the owner of the comment", async () => {
    const payload = {
      accessToken: "token123",
      threadId: "thread-1",
      commentId: "comment-1",
    };

    mockTm.decodePayload.mockResolvedValue({ id: "user-1" });
    mockUsrRepo.mustExistOrThrowById.mockResolvedValue();
    mockThreadRepo.mustExistOrThrowId.mockResolvedValue();
    mockCommentRepo.mustExistOrThrowId.mockResolvedValue();

    mockCommentRepo.getByCommentId.mockResolvedValue({
      id: "comment-1",
      isDeleted: false,
      owner: "user-2", // bukan owner
    });

    await expect(useCase.execute(payload)).rejects.toThrow(
      "DELETE_COMMENT_ENTITIES.ONLY_OWNER_CAN_DELETE_COMMENT",
    );
  });
});

describe("DeleteCommentUseCase _verifyPayload", () => {
  let useCase;

  beforeEach(() => {
    useCase = new DeleteCommentUseCase(
      {}, // tm
      {}, // user repo
      {}, // comment repo
      {}, // thread repo
    );
  });

  it("should throw error when payload is empty", () => {
    expect(() => useCase._verifyPayload()).toThrow(Error);
  });

  it("should throw error when required properties are missing", () => {
    const payloadMissing = { accessToken: "abc" }; // missing commentId + threadId
    expect(() => useCase._verifyPayload(payloadMissing)).toThrow(Error);
  });

  it("should throw error when properties are not string", () => {
    const invalidPayload = {
      accessToken: 123,
      commentId: {},
      threadId: true,
    };
    expect(() => useCase._verifyPayload(invalidPayload)).toThrow(Error);
  });

  it("should not throw error when payload is valid", () => {
    const validPayload = {
      accessToken: "token",
      commentId: "comment-1",
      threadId: "thread-1",
    };
    expect(() => useCase._verifyPayload(validPayload)).not.toThrow();
  });

  it("should throw error when payload properties are not string", async () => {
    // Arrange
    const tm = {};
    const usrp = {};
    const crp = {};
    const thrp = {};

    const useCase = new DeleteCommentUseCase(tm, usrp, crp, thrp);

    // Act & Assert
    expect(() =>
      useCase._verifyPayload({
        commentId: "comment-123",
        threadId: "thread-123",
      }),
    ).toThrowError("DELETE_COMMENT.AUTHENTICATION_NOT_FOUND");
  });
});

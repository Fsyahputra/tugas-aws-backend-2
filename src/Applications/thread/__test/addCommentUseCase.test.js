// @ts-nocheck
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AddCommentUseCase = require("../addCommentUseCase");

describe("AddCommentUseCase", () => {
  it("should orchestrate the add comment action correctly", async () => {
    // Arrange
    const payload = {
      accessToken: "valid_token",
      threadId: "thread-123",
      content: "This is a comment",
    };

    const decodedPayload = { id: "user-123", username: "johndoe" };
    const expectedAddedComment = {
      id: "comment-123",
      content: payload.content,
      owner: decodedPayload.id,
    };
    // Mock dependencies
    const mockTokenManager = {
      decodePayload: jest.fn().mockResolvedValue(decodedPayload),
    };
    const mockUserRepository = {
      mustExistOrThrowById: jest.fn().mockResolvedValue(null),
    };
    const mockThreadRepository = {
      mustExistOrThrowId: jest.fn().mockResolvedValue(null),
    };
    const mockCommentRepository = {
      add: jest.fn().mockResolvedValue({
        id: "comment-123",
        content: payload.content,
        owner: decodedPayload.id,
      }),
    };

    const mockAuthenticationRepository = {};

    const useCase = new AddCommentUseCase(
      mockTokenManager,
      mockCommentRepository,
      mockUserRepository,
      mockThreadRepository,
    );
    // Act
    const result = await useCase.execute(payload);
    // Assert
    expect(result).toStrictEqual(expectedAddedComment);
    expect(mockTokenManager.decodePayload).toHaveBeenCalledWith(
      payload.accessToken,
    );
    expect(mockUserRepository.mustExistOrThrowById).toHaveBeenCalledWith(
      decodedPayload.id,
    );
    expect(mockThreadRepository.mustExistOrThrowId).toHaveBeenCalledWith(
      payload.threadId,
    );
    expect(mockCommentRepository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        content: payload.content,
        owner: decodedPayload.id,
        threadId: payload.threadId,
        username: decodedPayload.username,
      }),
    );
  });

  it("should throw error if token is invalid", async () => {
    const payload = {
      accessToken: "invalid_token",
      threadId: "thread-123",
      content: "text",
    };

    const mockTokenManager = {
      decodePayload: jest.fn().mockRejectedValue(new Error("Invalid token")),
    };

    const useCase = new AddCommentUseCase(
      mockTokenManager,
      {}, // CommentRepository
      {}, // UserRepository
      {}, // ThreadRepository
    );

    await expect(useCase.execute(payload)).rejects.toThrow("Invalid token");
  });

  it("should throw error if user does not exist", async () => {
    const payload = {
      accessToken: "valid_token",
      threadId: "thread-123",
      content: "text",
    };
    const decodedPayload = { id: "user-123", username: "johndoe" };

    const mockTokenManager = {
      decodePayload: jest.fn().mockResolvedValue(decodedPayload),
    };
    const mockUserRepository = {
      mustExistOrThrowById: jest
        .fn()
        .mockRejectedValue(new Error("User not found")),
    };

    const useCase = new AddCommentUseCase(
      mockTokenManager,
      {}, // CommentRepository
      mockUserRepository,
      {}, // ThreadRepository
    );

    await expect(useCase.execute(payload)).rejects.toThrow("User not found");
  });

  it("should throw error if thread does not exist", async () => {
    const payload = {
      accessToken: "valid_token",
      threadId: "thread-123",
      content: "text",
    };
    const decodedPayload = { id: "user-123", username: "johndoe" };

    const mockTokenManager = {
      decodePayload: jest.fn().mockResolvedValue(decodedPayload),
    };
    const mockUserRepository = {
      mustExistOrThrowById: jest.fn().mockResolvedValue(),
    };
    const mockThreadRepository = {
      mustExistOrThrowId: jest
        .fn()
        .mockRejectedValue(new Error("Thread not found")),
    };
    const useCase = new AddCommentUseCase(
      mockTokenManager,
      {}, // CommentRepository
      mockUserRepository,
      mockThreadRepository,
    );
    await expect(useCase.execute(payload)).rejects.toThrow("Thread not found");
  });
});

describe("AddCommentUseCase _verifyPayload", () => {
  let useCase;

  beforeEach(() => {
    useCase = new AddCommentUseCase(
      {}, // AuthenticationRepository
      {}, // TokenManager
      {}, // CommentRepository
      {}, // UserRepository
      {}, // ThreadRepository
    );
  });

  it("should throw error when payload is empty", () => {
    expect(() => useCase._verifyPayload()).toThrow();
  });

  it("should throw error when required properties are missing", () => {
    const payloadMissing = { accessToken: "token" }; // missing threadId + content
    expect(() => useCase._verifyPayload(payloadMissing)).toThrow();
  });

  it("should throw error when properties are not string", () => {
    const invalidPayload = {
      accessToken: 123,
      threadId: {},
      content: true,
    };
    expect(() => useCase._verifyPayload(invalidPayload)).toThrow();
  });

  it("should not throw error when payload is valid", () => {
    const validPayload = {
      accessToken: "token",
      threadId: "thread-1",
      content: "Some comment",
    };
    expect(() => useCase._verifyPayload(validPayload)).not.toThrow();
  });

  it("should throw error if accessToken is missing", () => {
    const payload = {
      threadId: "thread-123",
      content: "This is a comment",
    };
    expect(() => useCase._verifyPayload(payload)).toThrow(
      "ADD_COMMENT.AUTHENTICATION_NOT_FOUND",
    );
  });
});

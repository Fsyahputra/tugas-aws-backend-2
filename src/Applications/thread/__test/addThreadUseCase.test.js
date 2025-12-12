// @ts-nocheck
const AddedThread = require("../../../Domains/thread/entities/addedThread");
const AddThreadUseCase = require("../addThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    const payload = {
      accessToken: "valid_token",
      title: "Thread Title",
      body: "Thread Body",
    };

    const decodedPayload = { id: "user-123" };

    const expectedAddedThread = new AddedThread({
      id: "thread-123",
      title: payload.title,
      body: payload.body,
      date: new Date("2025-12-03T12:00:00Z"),
      owner: decodedPayload.id,
    });

    const mockThreadRepository = {
      addThread: jest.fn().mockResolvedValue(expectedAddedThread),
    };

    const mockUserRepository = {
      mustExistOrThrowById: jest.fn().mockResolvedValue(null),
    };

    const mockTokenManager = {
      decodePayload: jest.fn().mockResolvedValue(decodedPayload),
    };

    const useCase = new AddThreadUseCase(
      mockThreadRepository,
      mockTokenManager,
      mockUserRepository,
    );

    const result = await useCase.execute(payload);

    expect(result).toMatchObject({
      id: expectedAddedThread.id,
      title: expectedAddedThread.title,
      owner: expectedAddedThread.owner,
    });
    expect(mockTokenManager.decodePayload).toHaveBeenCalledWith(
      payload.accessToken,
    );
    expect(mockUserRepository.mustExistOrThrowById).toHaveBeenCalledWith(
      decodedPayload.id,
    );
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
      title: payload.title,
      body: payload.body,
      owner: decodedPayload.id,
    });
  });

  it("should throw error if token is invalid", async () => {
    const payload = {
      accessToken: "invalid_token",
      title: "Title",
      body: "Body",
    };

    const mockTokenManager = {
      decodePayload: jest.fn().mockRejectedValue(new Error("Invalid token")),
    };
    const mockUserRepository = { mustExistOrThrowById: jest.fn() };
    const mockThreadRepository = {
      addThread: jest.fn().mockImplementation(
        (thread) =>
          new AddedThread({
            ...thread,
            id: "thread-123",
            date: new Date(),
          }),
      ),
    };

    const useCase = new AddThreadUseCase(
      mockThreadRepository,
      mockTokenManager,
      mockUserRepository,
    );

    await expect(useCase.execute(payload)).rejects.toThrow("Invalid token");
    expect(mockTokenManager.decodePayload).toHaveBeenCalledWith(
      payload.accessToken,
    );
    expect(mockUserRepository.mustExistOrThrowById).not.toHaveBeenCalled();
    expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
  });

  it("should throw error if user does not exist", async () => {
    const payload = {
      accessToken: "valid_token",
      title: "Title",
      body: "Body",
    };
    const decodedPayload = { id: "user-123" };

    const mockTokenManager = {
      decodePayload: jest.fn().mockResolvedValue(decodedPayload),
    };
    const mockUserRepository = {
      mustExistOrThrowById: jest
        .fn()
        .mockRejectedValue(new Error("User not found")),
    };
    const mockThreadRepository = {
      addThread: jest.fn().mockImplementation(
        (thread) =>
          new AddedThread({
            ...thread,
            id: "thread-123",
            date: new Date(),
          }),
      ),
    };

    const useCase = new AddThreadUseCase(
      mockThreadRepository,
      mockTokenManager,
      mockUserRepository,
    );

    await expect(useCase.execute(payload)).rejects.toThrow("User not found");
    expect(mockTokenManager.decodePayload).toHaveBeenCalledWith(
      payload.accessToken,
    );
    expect(mockUserRepository.mustExistOrThrowById).toHaveBeenCalledWith(
      decodedPayload.id,
    );
    expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
  });

  describe("_verifyPayload", () => {
    const mockThreadRepository = {};
    const mockTokenManager = {};
    const mockUserRepository = {};
    const useCase = new AddThreadUseCase(
      mockThreadRepository,
      mockTokenManager,
      mockUserRepository,
    );

    it("should throw error when payload is empty", () => {
      expect(() => useCase._verifyPayload()).toThrow(Error);
    });

    it("should throw error when required properties are missing", () => {
      const payloadMissing = { accessToken: "abc" }; // missing title + body
      expect(() => useCase._verifyPayload(payloadMissing)).toThrow(Error);
    });

    it("should throw error when properties are not string", () => {
      const invalidPayload = { accessToken: 123, title: {}, body: true };
      expect(() => useCase._verifyPayload(invalidPayload)).toThrow(Error);
    });

    it("should not throw error when payload is valid", () => {
      const validPayload = {
        accessToken: "token",
        title: "some title",
        body: "some body",
      };
      expect(() => useCase._verifyPayload(validPayload)).not.toThrow();
    });
  });
});

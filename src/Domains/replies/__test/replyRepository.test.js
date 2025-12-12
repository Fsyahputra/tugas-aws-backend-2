const ReplyRepository = require("../replyRepository");

describe("repyRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.getById({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.getByCommentId("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.add("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.del("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.mustExistOrThrowId("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});

const CommentRepository = require("../commentRepository");

describe("commentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.add({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.getByThreadId("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.getByCommentId("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.mustExistOrThrowId("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.delete("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});

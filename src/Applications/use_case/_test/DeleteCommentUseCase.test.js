const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // buat mock repository
    const mockThreadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
    };
    const mockCommentRepository = {
      verifyCommentExists: jest.fn(() => Promise.resolve()),
      verifyCommentOwner: jest.fn(() => Promise.resolve()),
      softDeleteComment: jest.fn(() => Promise.resolve()),
    };

    // buat instance usecase dengan dependency injection
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.verifyCommentExists)
      .toHaveBeenCalledWith(useCasePayload.commentId);

    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockCommentRepository.softDeleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});

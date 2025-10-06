const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    // Mock semua repository
    const mockThreadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
    };
    const mockCommentRepository = {
      verifyCommentExists: jest.fn(() => Promise.resolve()),
    };
    const mockReplyRepository = {
      verifyReplyExists: jest.fn(() => Promise.resolve()),
      verifyReplyOwner: jest.fn(() => Promise.resolve()),
      softDeleteReply: jest.fn(() => Promise.resolve()),
    };

    // Buat instance use case
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.verifyCommentExists)
      .toHaveBeenCalledWith(useCasePayload.commentId);

    expect(mockReplyRepository.verifyReplyExists)
      .toHaveBeenCalledWith(useCasePayload.replyId);

    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.owner);

    expect(mockReplyRepository.softDeleteReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
  });
});

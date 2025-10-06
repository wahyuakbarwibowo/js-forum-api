const CommentRepository = require('../CommentRepository');

describe('CommentRepository abstract class', () => {
  it('should throw error when invoke unimplemented addComment method', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment({}))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented verifyCommentExists method', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.verifyCommentExists('comment-123'))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented verifyCommentOwner method', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.verifyCommentOwner('comment-123', 'user-123'))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented softDeleteComment method', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.softDeleteComment('comment-123'))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

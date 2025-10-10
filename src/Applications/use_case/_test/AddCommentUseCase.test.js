const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate add comment correctly', async () => {
    const payload = {
      content: 'sebuah komentar',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah komentar',
      owner: 'user-123',
    });

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();

    mockThreadRepo.verifyThreadExists = jest.fn().mockResolvedValue();
    mockCommentRepo.addComment = jest.fn().mockResolvedValue(new AddedComment({
      id: 'comment-123',
      content: payload.content,
      owner: payload.owner,
    }));

    const useCase = new AddCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
    });

    const result = await useCase.execute(payload);

    expect(mockThreadRepo.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepo.addComment).toBeCalledWith(new NewComment(payload));
    expect(result).toStrictEqual(expectedAddedComment);
  });
});

const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('AddReplyUseCase', () => {
  it('should orchestrate add reply correctly', async () => {
    const payload = {
      content: 'balasan',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'balasan',
      owner: 'user-123',
    });

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();

    mockThreadRepo.verifyThreadExists = jest.fn().mockResolvedValue();
    mockCommentRepo.verifyCommentExists = jest.fn().mockResolvedValue();
    mockReplyRepo.addReply = jest.fn().mockResolvedValue(new AddedReply({
      id: 'reply-123',
      content: payload.content,
      owner: payload.owner,
    }));

    const useCase = new AddReplyUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    const result = await useCase.execute(payload);

    expect(mockThreadRepo.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepo.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockReplyRepo.addReply).toBeCalledWith(new NewReply(payload));
    expect(result).toStrictEqual(expectedAddedReply);
  });
});

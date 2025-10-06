const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate get thread detail correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'Sebuah thread',
      body: 'Isi dari thread',
      date: '2023-10-05T10:00:00.000Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2023-10-05T10:10:00.000Z',
        content: 'komentar pertama',
        is_deleted: false,
      },
      {
        id: 'comment-124',
        username: 'janedoe',
        date: '2023-10-05T10:15:00.000Z',
        content: 'komentar yang dihapus',
        is_deleted: true,
      },
    ];

    const mockRepliesForComment123 = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2023-10-05T10:20:00.000Z',
        content: 'balasan 1',
        is_deleted: false,
      },
      {
        id: 'reply-124',
        username: 'budi',
        date: '2023-10-05T10:25:00.000Z',
        content: 'balasan dihapus',
        is_deleted: true,
      },
    ];

    const mockRepliesForComment124 = [];

    // Mock repository dependencies
    const mockThreadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
      getThreadById: jest.fn(() => Promise.resolve(mockThread)),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn(() => Promise.resolve(mockComments)),
    };
    const mockReplyRepository = {
      getRepliesByCommentId: jest.fn((commentId) => {
        if (commentId === 'comment-123') return Promise.resolve(mockRepliesForComment123);
        if (commentId === 'comment-124') return Promise.resolve(mockRepliesForComment124);
        return Promise.resolve([]);
      }),
    };

    // Create use case instance
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const result = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledTimes(mockComments.length);

    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'Sebuah thread',
      body: 'Isi dari thread',
      date: '2023-10-05T10:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2023-10-05T10:10:00.000Z',
          content: 'komentar pertama',
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: '2023-10-05T10:20:00.000Z',
              content: 'balasan 1',
            },
            {
              id: 'reply-124',
              username: 'budi',
              date: '2023-10-05T10:25:00.000Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-124',
          username: 'janedoe',
          date: '2023-10-05T10:15:00.000Z',
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    });
  });
});

const Hapi = require('@hapi/hapi');
const repliesPlugin = require('../index');
const AddReplyUseCase = require('../../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../../Applications/use_case/DeleteReplyUseCase');

describe('replies plugin (integration test)', () => {
  let server;
  let mockContainer;
  let mockAddReplyUseCase;
  let mockDeleteReplyUseCase;

  beforeEach(async () => {
    mockAddReplyUseCase = {
      execute: jest.fn().mockResolvedValue({
        id: 'reply-123',
        content: 'balasan',
        owner: 'user-123',
      })
    };

    mockDeleteReplyUseCase = { execute: jest.fn().mockResolvedValue() };

    mockContainer = {
      getInstance: jest.fn((useCaseName) => {
        if (useCaseName === AddReplyUseCase.name) return mockAddReplyUseCase;
        if (useCaseName === DeleteReplyUseCase.name) return mockDeleteReplyUseCase;
      }),
    };

    server = Hapi.server({ port: 4000 });

    await server.auth.scheme('fake', () => ({
      authenticate: (request, h) => h.authenticated({ credentials: { id: 'user-123' } }),
    }));
    server.auth.strategy('forumapi_jwt', 'fake');
    server.auth.default('forumapi_jwt');

    await server.register({
      plugin: repliesPlugin,
      options: { container: mockContainer },
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should register POST /threads/{threadId}/comments/{commentId}/replies route', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments/comment-123/replies',
      auth: { credentials: { id: 'user-123' }, strategy: 'forumapi_jwt' },
      payload: { content: 'balasan' },
    });

    expect(response.statusCode).toBe(201);
    const json = JSON.parse(response.payload);
    expect(json.status).toBe('success');
    expect(json.data.addedReply).toEqual({
      id: 'reply-123',
      content: 'balasan',
      owner: 'user-123',
    });
    expect(mockAddReplyUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should register DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId} route', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      auth: { credentials: { id: 'user-123' }, strategy: 'forumapi_jwt' },
    });

    expect(response.statusCode).toBe(200);
    const json = JSON.parse(response.payload);
    expect(json.status).toBe('success');
    expect(mockDeleteReplyUseCase.execute).toHaveBeenCalledWith({
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    });
  });
});

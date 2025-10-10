const Hapi = require('@hapi/hapi');
const threadsPlugin = require('../index');
const AddThreadUseCase = require('../../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../../Applications/use_case/GetThreadDetailUseCase');

describe('threads plugin (integration test)', () => {
  let server;
  let mockContainer;
  let mockAddThreadUseCase;
  let mockGetThreadDetailUseCase;

  beforeEach(async () => {
    mockAddThreadUseCase = {
      execute: jest.fn().mockResolvedValue({
        id: 'thread-123',
        title: 'judul thread',
        owner: 'user-123',
      }),
    };

    mockGetThreadDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        id: 'thread-123',
        title: 'judul thread',
        body: 'isi thread',
        username: 'dicoding',
      }),
    };

    mockContainer = {
      getInstance: jest.fn((useCaseName) => {
        if (useCaseName === AddThreadUseCase.name) return mockAddThreadUseCase;
        if (useCaseName === GetThreadDetailUseCase.name) return mockGetThreadDetailUseCase;
      }),
    };

    server = Hapi.server({ port: 4000 });

    await server.auth.scheme('fake', () => ({
      authenticate: (request, h) => h.authenticated({ credentials: { id: 'user-123' } }),
    }));
    server.auth.strategy('forumapi_jwt', 'fake');
    server.auth.default('forumapi_jwt');

    await server.register({
      plugin: threadsPlugin,
      options: { container: mockContainer },
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should register POST /threads route', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'judul thread',
        body: 'isi thread',
      },
      auth: { strategy: 'forumapi_jwt', credentials: { id: 'user-123' } },
    });

    expect(response.statusCode).toBe(201);
    const json = JSON.parse(response.payload);
    expect(json.status).toBe('success');
    expect(json.data.addedThread).toEqual({
      id: 'thread-123',
      title: 'judul thread',
      owner: 'user-123',
    });
  });

  it('should register GET /threads/{threadId} route', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/threads/thread-123',
    });

    expect(response.statusCode).toBe(200);
    const json = JSON.parse(response.payload);
    expect(json.status).toBe('success');
    expect(json.data.thread).toEqual({
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      username: 'dicoding',
    });
  });
});

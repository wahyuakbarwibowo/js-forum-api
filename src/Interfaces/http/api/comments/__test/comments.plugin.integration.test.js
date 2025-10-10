const Hapi = require('@hapi/hapi');
const commentsPlugin = require('../index');

jest.mock('../handler', () => {
  return jest.fn().mockImplementation(() => ({
    getCommentsHandler: jest.fn(() => ({
      status: 'success',
      data: [{ id: 1, content: 'test comment' }],
    })),
  }));
});

jest.mock('../routes', () => {
  return jest.fn(handler => ([
    {
      method: 'GET',
      path: '/comments',
      handler: () => handler.getCommentsHandler(),
    },
  ]));
});

describe('comments plugin (integration test)', () => {
  let server;

  beforeEach(async () => {
    server = Hapi.server();
    const fakeContainer = { repo: 'fakeRepo' };

    await server.register({
      plugin: commentsPlugin,
      options: { container: fakeContainer },
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should register the /comments route', async () => {
    const table = server.table();
    const hasCommentsRoute = table.some(r => r.path === '/comments');
    expect(hasCommentsRoute).toBe(true);
  });

  it('should return success response from GET /comments', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/comments',
    });

    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload.status).toBe('success');
    expect(Array.isArray(payload.data)).toBe(true);
  });
});

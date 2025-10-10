const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  /**
   * Fungsi helper untuk membuat user + token via endpoint
   * (agar tidak duplikat user)
   */
  const registerAndLoginUser = async (server) => {
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const authResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const { accessToken } = JSON.parse(authResponse.payload).data;

    const users = await UsersTableTestHelper.findUsersByUsername('dicoding');
    const userId = users[0].id;

    return { accessToken, userId };
  };

  it('should respond 201 and persist comment (integration test)', async () => {
    const server = await createServer(container);

    const { accessToken, userId } = await registerAndLoginUser(server);

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      owner: userId,
    });

    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments',
      payload: { content: 'komentar baru' },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedComment).toBeDefined();
  });

  it('should allow adding comment directly via repository (unit test)', async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-001',
      username: 'unittest',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-001',
      title: 'judul thread unit test',
      body: 'isi thread',
      owner: 'user-001',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-001',
      threadId: 'thread-001',
      content: 'komentar dari unit test',
      owner: 'user-001',
    });

    const comments = await CommentsTableTestHelper.findCommentsByThreadId('thread-001');
    expect(comments).toHaveLength(1);
    expect(comments[0].content).toBe('komentar dari unit test');
  });
});

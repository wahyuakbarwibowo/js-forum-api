const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  beforeEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const registerAndLoginUser = async (server) => {
    // 1️⃣ Register user
    const registerResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const registerJson = JSON.parse(registerResponse.payload);
    expect(registerResponse.statusCode).toBe(201);
    expect(registerJson.status).toBe('success');

    // 2️⃣ Login untuk dapatkan token
    const authResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username: 'dicoding', password: 'secret' },
    });

    expect(authResponse.statusCode).toBe(201); // Pastikan login sukses
    const { accessToken } = JSON.parse(authResponse.payload).data;

    // 3️⃣ Ambil userId dari tabel
    const users = await UsersTableTestHelper.findUsersByUsername('dicoding');
    const userId = users[0].id;

    return { accessToken, userId };
  };

  it('should respond 201 and persist reply', async () => {
    // Arrange
    const server = await createServer(container);
    const { accessToken, userId } = await registerAndLoginUser(server);

    // buat thread & comment secara langsung via helper
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: userId,
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
      owner: userId,
    });

    // Act
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments/comment-123/replies',
      payload: { content: 'balasan baru' },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedReply).toBeDefined();
  });
});

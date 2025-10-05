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

  it('should respond 201 and persist comment', async () => {
    // Arrange
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    const authResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username: 'dicoding', password: 'secret' },
    });
    console.log(authResponse)
    const { accessToken } = JSON.parse(authResponse.payload).data;

    // Act
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments',
      payload: { content: 'komentar baru' },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedComment).toBeDefined();
  });
});

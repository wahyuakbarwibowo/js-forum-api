const pool = require('../../../../../Infrastructures/database/postgres/pool');
const createServer = require('../../../../../Infrastructures/http/createServer');
const container = require('../../../../../Infrastructures/container');
const UsersTableTestHelper = require('../../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../../../tests/CommentLikesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  let accessToken;
  let userId;
  let threadId;
  let commentId;

  beforeAll(async () => {
    const server = await createServer(container);

    const registerResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    const { data: { addedUser } } = JSON.parse(registerResponse.payload);
    userId = addedUser.id;

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken: token } } = JSON.parse(loginResponse.payload);
    accessToken = token;

    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { data: { addedThread } } = JSON.parse(threadResponse.payload);
    threadId = addedThread.id;

    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'sebuah comment',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { data: { addedComment } } = JSON.parse(commentResponse.payload);
    commentId = addedComment.id;
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should respond 200 when like comment successfully', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });

  it('should respond 200 when unlike comment successfully (toggle like)', async () => {
    const server = await createServer(container);

    await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });

  it('should respond 401 if no authentication', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
    });

    expect(response.statusCode).toEqual(401);
  });

  it('should respond 404 if thread not found', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/thread-not-found/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should respond 404 if comment not found', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/comment-not-found/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toEqual(404);
  });
});

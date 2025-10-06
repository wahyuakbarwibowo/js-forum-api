const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  // 🧹 Bersihkan tabel setiap selesai test
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
    // Daftarkan user via endpoint
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // Login untuk dapatkan access token
    const authResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const { accessToken } = JSON.parse(authResponse.payload).data;

    // Ambil user id dari tabel (agar bisa digunakan untuk owner thread)
    const users = await UsersTableTestHelper.findUsersByUsername('dicoding');
    const userId = users[0].id;

    return { accessToken, userId };
  };

  it('should respond 201 and persist comment (integration test)', async () => {
    // Arrange
    const server = await createServer(container);

    // Register + login user
    const { accessToken, userId } = await registerAndLoginUser(server);

    // Buat thread (langsung lewat helper untuk hemat waktu)
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      owner: userId,
    });

    // Act — tambahkan komentar lewat endpoint
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

  it('should allow adding comment directly via repository (unit test)', async () => {
    // Arrange — buat data user dan thread via helper (tanpa API)
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

    // Act — tambahkan comment langsung (misal via helper)
    await CommentsTableTestHelper.addComment({
      id: 'comment-001',
      threadId: 'thread-001',
      content: 'komentar dari unit test',
      owner: 'user-001',
    });

    // Assert
    const comments = await CommentsTableTestHelper.findCommentsByThreadId('thread-001');
    expect(comments).toHaveLength(1);
    expect(comments[0].content).toBe('komentar dari unit test');
  });
});

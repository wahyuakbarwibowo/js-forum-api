const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return AddedThread correctly', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const newThread = {
        title: 'sebuah judul',
        body: 'sebuah body thread',
        owner: 'user-123',
      };

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'sebuah judul',
          owner: 'user-123',
        })
      );
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread does not exist', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-xxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread exists', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });

      await expect(threadRepositoryPostgres.verifyThreadExists('thread-1'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.getThreadById('thread-xxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return thread data correctly when found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      const date = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'judul thread',
        body: 'isi thread',
        owner: 'user-1',
        date,
      });

      const thread = await threadRepositoryPostgres.getThreadById('thread-1');

      expect(thread).toStrictEqual({
        id: 'thread-1',
        title: 'judul thread',
        body: 'isi thread',
        date: thread.date,
        username: 'dicoding',
      });
    });
  });
});

const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment and return AddedComment correctly', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread test',
        body: 'isi thread',
        owner: 'user-123',
      });

      const newComment = {
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'sebuah komentar',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-xxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment exists', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-xxx', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not the owner', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'someone' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        owner: 'user-1',
      });

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-1', 'user-2'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is the owner', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        owner: 'user-1',
      });

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-1', 'user-1'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('softDeleteComment function', () => {
    it('should set is_deleted to true', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        owner: 'user-1',
      });

      await commentRepositoryPostgres.softDeleteComment('comment-1');
      const comments = await CommentsTableTestHelper.findCommentById('comment-1');
      expect(comments[0].is_deleted).toBe(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments by threadId correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        owner: 'user-1',
        content: 'komentar pertama',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        threadId: 'thread-1',
        owner: 'user-1',
        content: 'komentar kedua',
        isDeleted: true,
      });

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');

      expect(comments).toHaveLength(2);
      expect(comments[0]).toHaveProperty('id', 'comment-1');
      expect(comments[0]).toHaveProperty('username', 'dicoding');
      expect(comments[0]).toHaveProperty('date');
      expect(comments[0]).toHaveProperty('content', 'komentar pertama');
      expect(comments[0]).toHaveProperty('is_deleted', false);

      expect(comments[1]).toHaveProperty('id', 'comment-2');
      expect(comments[1]).toHaveProperty('username', 'dicoding');
      expect(comments[1]).toHaveProperty('date');
      expect(comments[1]).toHaveProperty('content', 'komentar kedua');
      expect(comments[1]).toHaveProperty('is_deleted', true);
    });
  });
});

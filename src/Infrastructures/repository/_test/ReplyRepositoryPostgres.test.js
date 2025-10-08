const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

// test helpers
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
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

  describe('addReply function', () => {
    it('should persist reply and return AddedReply correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const newReply = {
        content: 'sebuah balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply does not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-xxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when reply exists', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });
      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-1', threadId: 'thread-1', owner: 'user-1' });

      await expect(replyRepositoryPostgres.verifyReplyExists('reply-1'))
        .resolves.not.toThrowError();
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-xxx', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner does not match', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'bukanpemilik' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });
      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-1', threadId: 'thread-1', owner: 'user-1' });

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-1', 'user-2'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when owner matches', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });
      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-1', threadId: 'thread-1', owner: 'user-1' });

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-1', 'user-1'))
        .resolves.not.toThrowError();
    });
  });

  describe('softDeleteReply function', () => {
    it('should set is_deleted to true', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });
      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-1', threadId: 'thread-1', owner: 'user-1' });

      await replyRepositoryPostgres.softDeleteReply('reply-1');
      const replies = await RepliesTableTestHelper.findReplyById('reply-1');
      expect(replies[0].is_deleted).toBe(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies with proper content handling', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-1',
        commentId: 'comment-1',
        threadId: 'thread-1',
        owner: 'user-1',
        content: 'balasan aktif',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-2',
        commentId: 'comment-1',
        threadId: 'thread-1',
        owner: 'user-1',
        content: 'balasan terhapus',
        isDeleted: true,
      });

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-1');
      expect(replies).toHaveLength(2);
      expect(replies[0].content).toBe('balasan aktif');
      expect(replies[1].content).toBe('**balasan telah dihapus**');
    });
  });
});

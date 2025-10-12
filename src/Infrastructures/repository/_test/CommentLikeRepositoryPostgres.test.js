const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('CommentLikeRepositoryPostgres', () => {
  let commentId;
  let owner;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

    commentId = 'comment-123';
    owner = 'user-123';
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

  describe('addLike function', () => {
    it('should persist like in database', async () => {
      const repo = new CommentLikeRepositoryPostgres(pool);
      await repo.addLike(commentId, owner);

      const result = await CommentLikesTableTestHelper.findLikeByCommentIdAndOwner(commentId, owner);
      expect(result).toHaveLength(1);
      expect(result[0].comment_id).toEqual(commentId);
      expect(result[0].owner).toEqual(owner);
    });
  });

  describe('verifyCommentLike function', () => {
    it('should return true if like exists', async () => {
      await CommentLikesTableTestHelper.addLike({ commentId, owner });
      const repo = new CommentLikeRepositoryPostgres(pool);

      const isLiked = await repo.verifyCommentLike(commentId, owner);
      expect(isLiked).toBe(true);
    });

    it('should return false if like not exists', async () => {
      const repo = new CommentLikeRepositoryPostgres(pool);
      const isLiked = await repo.verifyCommentLike(commentId, owner);
      expect(isLiked).toBe(false);
    });
  });

  describe('removeLike function', () => {
    it('should remove like from database', async () => {
      await CommentLikesTableTestHelper.addLike({ commentId, owner });
      const repo = new CommentLikeRepositoryPostgres(pool);

      await repo.removeLike(commentId, owner);

      const result = await CommentLikesTableTestHelper.findLikeByCommentIdAndOwner(commentId, owner);
      expect(result).toHaveLength(0);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return correct like count', async () => {
      const repo = new CommentLikeRepositoryPostgres(pool);

      await CommentLikesTableTestHelper.addLike({ id: 'like-1', commentId, owner: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'second' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-2', commentId, owner: 'user-456' });

      const count = await repo.getLikeCountByCommentId(commentId);
      expect(count).toEqual(2);
    });

    it('should return 0 when no like found', async () => {
      const repo = new CommentLikeRepositoryPostgres(pool);
      const count = await repo.getLikeCountByCommentId(commentId);
      expect(count).toEqual(0);
    });
  });
});

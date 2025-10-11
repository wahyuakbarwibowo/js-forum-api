const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, threadId, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO replies (id, content, comment_id, thread_id, owner, date, is_deleted)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        RETURNING id, content, owner
      `,
      values: [id, content, commentId, threadId, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async verifyReplyExists(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Balasan tidak ditemukan');
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Balasan tidak ditemukan');

    const reply = result.rows[0];
    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini');
    }
  }

  async softDeleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
        SELECT replies.id, replies.content, replies.date, replies.is_deleted, users.username
        FROM replies
        JOIN users ON replies.owner = users.id
        WHERE replies.comment_id = $1
        ORDER BY replies.date ASC
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;

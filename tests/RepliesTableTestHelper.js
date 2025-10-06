/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah balasan',
    commentId = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    date = new Date().toISOString(),
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO replies (id, content, comment_id, thread_id, owner, date, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, commentId, threadId, owner, date, isDeleted],
    };
    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;

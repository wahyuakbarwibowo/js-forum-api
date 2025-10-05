class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExists(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    for (const comment of comments) {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      comment.replies = replies.map((reply) => ({
        id: reply.id,
        content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
        date: reply.date,
        username: reply.username,
      }));

      if (comment.is_deleted) comment.content = '**komentar telah dihapus**';
      delete comment.is_deleted;
    }

    thread.comments = comments;
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;

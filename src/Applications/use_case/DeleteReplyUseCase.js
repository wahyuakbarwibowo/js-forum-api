const InvariantError = require('../../Commons/exceptions/InvariantError');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, replyId, owner }) {
    // Pastikan thread & comment ada
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._replyRepository.verifyReplyExists(replyId);

    // Pastikan owner yang sama
    await this._replyRepository.verifyReplyOwner(replyId, owner);

    // Lakukan soft delete
    await this._replyRepository.softDeleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;

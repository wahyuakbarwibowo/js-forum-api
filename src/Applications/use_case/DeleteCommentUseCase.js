class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    // pastikan thread ada
    await this._threadRepository.verifyThreadExists(threadId);
    // pastikan comment ada
    await this._commentRepository.verifyCommentExists(commentId);
    // pastikan pemiliknya sesuai
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    // lakukan soft delete
    await this._commentRepository.softDeleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;

class ToggleLikeUseCase {
  constructor({ commentLikeRepository, commentRepository, threadRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentExists(commentId);

    const isLiked = await this._commentLikeRepository.verifyCommentLike(commentId, owner);

    if (isLiked) {
      await this._commentLikeRepository.removeLike(commentId, owner);
    } else {
      await this._commentLikeRepository.addLike(commentId, owner);
    }
  }
}

module.exports = ToggleLikeUseCase;

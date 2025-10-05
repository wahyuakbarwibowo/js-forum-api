const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { content, threadId, owner } = useCasePayload;

    // pastikan thread-nya valid
    await this._threadRepository.verifyThreadExists(threadId);

    // buat entity comment baru
    const newComment = new NewComment({ content, threadId, owner });

    // simpan ke repository
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;

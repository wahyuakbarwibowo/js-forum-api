const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { content, threadId, commentId, owner } = useCasePayload;

    // Pastikan thread & comment-nya valid
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);

    // Buat entity reply baru
    const newReply = new NewReply({ content, threadId, commentId, owner });

    // Simpan ke repository
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;

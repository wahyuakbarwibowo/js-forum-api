const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository abstract class', () => {
  it('should throw error when invoke unimplemented addReply method', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.addReply({}))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented verifyReplyExists method', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.verifyReplyExists('reply-123'))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented verifyReplyOwner method', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.verifyReplyOwner('reply-123', 'user-123'))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented deleteReplyById method', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.deleteReplyById('reply-123'))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented getRepliesByCommentIds method', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.getRepliesByCommentIds(['comment-123']))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

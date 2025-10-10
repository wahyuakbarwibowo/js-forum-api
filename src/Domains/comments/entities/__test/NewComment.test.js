const NewComment = require('../NewComment');

describe('NewComment entity', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      content: 'sebuah komentar',
      threadId: 'thread-123',
    };

    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property does not meet data type specification', () => {
    const payload = {
      content: true,
      threadId: 123,
      owner: {},
    };

    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'komentar baru',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});

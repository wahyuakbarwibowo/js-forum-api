const NewComment = require('../NewComment');

describe('NewComment entity', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
      threadId: 'thread-123',
      // owner hilang
    };

    // Action & Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property does not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      threadId: 123,
      owner: {},
    };

    // Action & Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'komentar baru',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});

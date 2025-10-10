const NewReply = require('../NewReply');

describe('NewReply entity', () => {
  it('should throw error when not contain needed property', () => {

    const payload = {
      content: 'sebuah balasan',
      threadId: 'thread-123',

      owner: 'user-123',
    };


    expect(() => new NewReply(payload))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content property does not meet data type specification', () => {

    const payload = {
      content: 1234,
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };


    expect(() => new NewReply(payload))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {

    const payload = {
      content: 'balasan valid',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };


    const newReply = new NewReply(payload);


    expect(newReply.content).toEqual(payload.content);
    expect(newReply.threadId).toEqual(payload.threadId);
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.owner).toEqual(payload.owner);
  });
});

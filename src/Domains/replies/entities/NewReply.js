class NewReply {
  constructor(payload) {
    const { content, threadId, commentId, owner } = payload;

    if (!content || !threadId || !commentId || !owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }
}

module.exports = NewReply;

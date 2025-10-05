class NewComment {
  constructor(payload) {
    const { content, threadId, owner } = payload;

    if (!content || !threadId || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }
}

module.exports = NewComment;

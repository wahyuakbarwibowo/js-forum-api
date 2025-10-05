class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance('AddReplyUseCase');
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addedReply = await addReplyUseCase.execute({
      content: request.payload.content,
      threadId,
      commentId,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });
    response.code(201);
    return response;
  }
}
module.exports = RepliesHandler;

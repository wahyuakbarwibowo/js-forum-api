class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance('AddThreadUseCase');
    const { id: credentialId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({
      title: request.payload.title,
      body: request.payload.body,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const getThreadUseCase = this._container.getInstance('GetThreadDetailUseCase');
    const { threadId } = request.params;

    const thread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: { thread },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;

const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const ownerId = request.auth.credentials.id;

    const addedThread = await addThreadUseCase.execute({
      title: request.payload.title,
      body: request.payload.body,
      owner: ownerId,
    });

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    })
      .code(201);
  }

  async getThreadDetailHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const { threadId } = request.params;

    const thread = await getThreadUseCase.execute(threadId);

    return h
      .response({
        status: 'success',
        data: { thread },
      })
      .code(200);
  }
}

module.exports = ThreadsHandler;

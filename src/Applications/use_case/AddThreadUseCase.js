const NewThread = require('../../Domains/threads/entities/NewThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);

    const addedThreadData = await this._threadRepository.addThread(newThread);

    return new AddedThread(addedThreadData);
  }
}

module.exports = AddThreadUseCase;

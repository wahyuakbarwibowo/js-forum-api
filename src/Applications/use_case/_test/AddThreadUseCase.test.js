const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('AddThreadUseCase', () => {
  it('should orchestrate add thread correctly', async () => {
    // Arrange
    const useCasePayload = { title: 'Judul', body: 'Isi' };
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'Judul',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn()
      .mockResolvedValue(expectedAddedThread);

    const useCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedThread = await useCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread)
      .toBeCalledWith(new NewThread(useCasePayload));
  });
});

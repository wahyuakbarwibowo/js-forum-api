const ThreadsHandler = require('../handler');
const AddThreadUseCase = require('../../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../../Applications/use_case/GetThreadDetailUseCase');

describe('ThreadsHandler', () => {
  describe('postThreadHandler', () => {
    it('should call AddThreadUseCase with correct params and return response 201', async () => {
      const mockAddedThread = {
        id: 'thread-123',
        title: 'judul thread',
        owner: 'user-123',
      };

      const mockAddThreadUseCase = {
        execute: jest.fn().mockResolvedValue(mockAddedThread),
      };

      const mockContainer = {
        getInstance: jest.fn(() => mockAddThreadUseCase),
      };

      const handler = new ThreadsHandler(mockContainer);

      const request = {
        payload: {
          title: 'judul thread',
          body: 'isi thread',
        },
        auth: {
          credentials: {
            id: 'user-123',
          },
        },
      };

      const h = {
        response: jest.fn().mockImplementation((res) => ({
          code: jest.fn().mockReturnValue(res),
        })),
      };

      const response = await handler.postThreadHandler(request, h);

      expect(mockContainer.getInstance).toBeCalledWith(AddThreadUseCase.name);
      expect(mockAddThreadUseCase.execute).toBeCalledWith({
        title: 'judul thread',
        body: 'isi thread',
        owner: 'user-123',
      });

      expect(response).toEqual({
        status: 'success',
        data: { addedThread: mockAddedThread },
      });
    });
  });

  describe('getThreadDetailHandler', () => {
    it('should call GetThreadDetailUseCase with correct params and return response 200', async () => {
      const mockThreadDetail = {
        id: 'thread-123',
        title: 'judul thread',
        body: 'isi thread',
        username: 'dicoding',
      };

      const mockGetThreadUseCase = {
        execute: jest.fn().mockResolvedValue(mockThreadDetail),
      };

      const mockContainer = {
        getInstance: jest.fn(() => mockGetThreadUseCase),
      };

      const handler = new ThreadsHandler(mockContainer);

      const request = {
        params: { threadId: 'thread-123' },
      };

      const h = {
        response: jest.fn((res) => ({
          code: jest.fn().mockReturnValue(res),
        })),
      };

      const response = await handler.getThreadDetailHandler(request, h);

      expect(mockContainer.getInstance).toBeCalledWith(GetThreadDetailUseCase.name);
      expect(mockGetThreadUseCase.execute).toBeCalledWith('thread-123');
      expect(response).toEqual({
        status: 'success',
        data: { thread: mockThreadDetail },
      });
    });
  });
});

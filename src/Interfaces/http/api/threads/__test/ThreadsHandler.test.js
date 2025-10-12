const ThreadsHandler = require('../handler');
const AddThreadUseCase = require('../../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../../Applications/use_case/GetThreadDetailUseCase');
const ToggleLikeUseCase = require('../../../../../Applications/use_case/ToggleLikeUseCase');

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
          credentials: { id: 'user-123' },
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

      const request = { params: { threadId: 'thread-123' } };

      const h = {
        response: jest.fn().mockImplementation((res) => ({
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

  describe('putLikeHandler', () => {
    it('should call ToggleLikeUseCase with correct params and return success response', async () => {
      const mockToggleLikeUseCase = {
        execute: jest.fn().mockResolvedValue(),
      };

      const mockContainer = {
        getInstance: jest.fn(() => mockToggleLikeUseCase),
      };

      const handler = new ThreadsHandler(mockContainer);

      const request = {
        auth: {
          credentials: { id: 'user-123' },
        },
        params: {
          threadId: 'thread-123',
          commentId: 'comment-456',
        },
      };

      const h = {
        response: jest.fn().mockImplementation((res) => ({
          code: jest.fn().mockReturnValue(res),
        })),
      };

      const response = await handler.putLikeHandler(request, h);

      expect(mockContainer.getInstance).toBeCalledWith(ToggleLikeUseCase.name);
      expect(mockToggleLikeUseCase.execute).toBeCalledWith(
        'thread-123',
        'comment-456',
        'user-123',
      );

      expect(response).toEqual({
        status: 'success',
      });
    });
  });
});

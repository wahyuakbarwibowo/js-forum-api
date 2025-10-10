const RepliesHandler = require('../handler');
const AddReplyUseCase = require('../../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../../Applications/use_case/DeleteReplyUseCase');

describe('RepliesHandler', () => {
  describe('postReplyHandler', () => {
    it('should call AddReplyUseCase with correct params and return response 201', async () => {
      const mockAddedReply = {
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      };

      const mockAddReplyUseCase = {
        execute: jest.fn().mockResolvedValue(mockAddedReply),
      };

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockAddReplyUseCase),
      };

      const handler = new RepliesHandler(mockContainer);

      const request = {
        params: {
          threadId: 'thread-123',
          commentId: 'comment-123',
        },
        payload: {
          content: 'sebuah balasan',
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

      const response = await handler.postReplyHandler(request, h);

      expect(mockContainer.getInstance).toHaveBeenCalledWith(AddReplyUseCase.name);
      expect(mockAddReplyUseCase.execute).toHaveBeenCalledWith({
        content: 'sebuah balasan',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      expect(h.response).toHaveBeenCalledWith({
        status: 'success',
        data: { addedReply: mockAddedReply },
      });
    });
  });

  describe('deleteReplyHandler', () => {
    it('should call DeleteReplyUseCase with correct params and return response 200', async () => {
      const mockDeleteReplyUseCase = {
        execute: jest.fn().mockResolvedValue(),
      };

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockDeleteReplyUseCase),
      };

      const handler = new RepliesHandler(mockContainer);

      const request = {
        params: {
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-123',
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

      const response = await handler.deleteReplyHandler(request, h);

      expect(mockContainer.getInstance).toHaveBeenCalledWith(DeleteReplyUseCase.name);
      expect(mockDeleteReplyUseCase.execute).toHaveBeenCalledWith({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });
      expect(h.response).toHaveBeenCalledWith({ status: 'success' });
      expect(response.status).toBe('success');
    });
  });
});
const CommentsHandler = require('../handler');
const AddCommentUseCase = require('../../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../../Applications/use_case/DeleteCommentUseCase');

describe('CommentsHandler', () => {
  describe('postCommentHandler function', () => {
    it('should call AddCommentUseCase correctly and return response 201', async () => {
      const mockAddedComment = {
        id: 'comment-123',
        content: 'sebuah komentar',
        owner: 'user-123',
      };

      const mockAddCommentUseCase = {
        execute: jest.fn().mockResolvedValue(mockAddedComment),
      };

      const mockContainer = {
        getInstance: jest.fn(() => mockAddCommentUseCase),
      };

      const handler = new CommentsHandler(mockContainer);

      const request = {
        params: {
          threadId: 'thread-123',
        },
        payload: {
          content: 'sebuah komentar',
        },
        auth: {
          credentials: {
            id: 'user-123',
          },
        },
      };

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnThis(),
        }),
      };

      await handler.postCommentHandler(request, h);

      expect(mockContainer.getInstance).toBeCalledWith(AddCommentUseCase.name);
      expect(mockAddCommentUseCase.execute).toBeCalledWith({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      expect(h.response).toBeCalledWith({
        status: 'success',
        data: { addedComment: mockAddedComment },
      });
    });
  });

  describe('deleteCommentHandler function', () => {
    it('should call DeleteCommentUseCase correctly and return response 200', async () => {
      const mockDeleteCommentUseCase = {
        execute: jest.fn().mockResolvedValue(),
      };

      const mockContainer = {
        getInstance: jest.fn(() => mockDeleteCommentUseCase),
      };

      const handler = new CommentsHandler(mockContainer);

      const request = {
        params: {
          threadId: 'thread-123',
          commentId: 'comment-123',
        },
        auth: {
          credentials: {
            id: 'user-123',
          },
        },
      };

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnThis(),
        }),
      };

      await handler.deleteCommentHandler(request, h);

      expect(mockContainer.getInstance).toBeCalledWith(DeleteCommentUseCase.name);
      expect(mockDeleteCommentUseCase.execute).toBeCalledWith({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      expect(h.response).toBeCalledWith({
        status: 'success',
      });
    });
  });
});

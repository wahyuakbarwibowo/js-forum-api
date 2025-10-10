const commentsPlugin = require('../index');
const CommentsHandler = require('../handler');
const routes = require('../routes');

jest.mock('../handler');
jest.mock('../routes');

describe('comments plugin (unit test)', () => {
  it('should register routes with a handler', async () => {
    const fakeServer = { route: jest.fn() };
    const fakeContainer = { someDep: 'test' };

    const fakeHandlerInstance = { handleSomething: jest.fn() };
    CommentsHandler.mockImplementation(() => fakeHandlerInstance);
    routes.mockReturnValue(['fakeRoute']);

    await commentsPlugin.register(fakeServer, { container: fakeContainer });

    expect(CommentsHandler).toHaveBeenCalledWith(fakeContainer);
    expect(routes).toHaveBeenCalledWith(fakeHandlerInstance);
    expect(fakeServer.route).toHaveBeenCalledWith(['fakeRoute']);
  });
});

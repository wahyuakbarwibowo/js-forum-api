const NewThread = require('../NewThread');

describe('NewThread entity', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Sebuah Thread',
      // body hilang
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewThread(payload))
      .toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property does not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: {},
    };

    // Action & Assert
    expect(() => new NewThread(payload))
      .toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Judul Thread',
      body: 'Isi body thread',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});

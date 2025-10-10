const AddedThread = require('../AddedThread');

describe('AddedThread entity', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'Sebuah Thread',
    };

    expect(() => new AddedThread(payload))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property does not meet data type specification', () => {
    const payload = {
      id: 123,
      title: true,
      owner: {},
    };

    expect(() => new AddedThread(payload))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Sebuah Thread',
      owner: 'user-123',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});

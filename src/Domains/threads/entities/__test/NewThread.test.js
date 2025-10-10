const NewThread = require('../NewThread');

describe('NewThread entity', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      title: 'Sebuah Thread',
      owner: 'user-123',
    };

    expect(() => new NewThread(payload))
      .toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property does not meet data type specification', () => {
    const payload = {
      title: 123,
      body: true,
      owner: {},
    };

    expect(() => new NewThread(payload))
      .toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'Judul Thread',
      body: 'Isi body thread',
      owner: 'user-123',
    };

    const newThread = new NewThread(payload);

    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});

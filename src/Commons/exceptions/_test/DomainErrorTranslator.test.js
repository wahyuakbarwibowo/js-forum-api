const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');
const NotFoundError = require('../NotFoundError');
const AuthorizationError = require('../AuthorizationError');

describe('DomainErrorTranslator', () => {
  it('should translate register user errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'));

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
  });

  it('should translate user repository errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('USER_REPOSITORY.USERNAME_NOT_AVAILABLE')))
      .toStrictEqual(new InvariantError('username tidak tersedia'));

    expect(DomainErrorTranslator.translate(new Error('USER_REPOSITORY.USERNAME_NOT_FOUND')))
      .toStrictEqual(new InvariantError('username tidak ditemukan'));

    expect(DomainErrorTranslator.translate(new Error('USER_REPOSITORY.USER_NOT_FOUND')))
      .toStrictEqual(new InvariantError('pengguna tidak ditemukan'));
  });

  it('should translate authentication repository errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('AUTHENTICATION_REPOSITORY.TOKEN_NOT_FOUND')))
      .toStrictEqual(new InvariantError('refresh token tidak ditemukan di database'));
  });

  it('should translate reply repository errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REPLY_REPOSITORY.REPLY_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('Balasan tidak ditemukan'));

    expect(DomainErrorTranslator.translate(new Error('REPLY_REPOSITORY.NOT_AUTHORIZED')))
      .toStrictEqual(new AuthorizationError('Anda tidak berhak menghapus balasan ini'));
  });

  it('should return the original error when message is not mapped', () => {
    const error = new Error('UNKNOWN_ERROR');
    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toStrictEqual(error);
  });
});

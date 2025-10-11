const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should persist token into database', async () => {
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token-123';

      await authenticationRepositoryPostgres.addToken(token);

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError when token not found in database', async () => {
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token-notfound';

      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw error when token exists in database', async () => {
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token-valid';
      await AuthenticationsTableTestHelper.addToken(token);

      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from database successfully', async () => {
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token-delete';
      await AuthenticationsTableTestHelper.addToken(token);

      await authenticationRepositoryPostgres.deleteToken(token);

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});

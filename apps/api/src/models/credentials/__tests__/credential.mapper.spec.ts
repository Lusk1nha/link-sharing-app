import { generateSingleMockCredential } from '../__mock__/credentials.mock';
import { CredentialMapper } from '../domain/credential.mapper';

describe(CredentialMapper.name, () => {
  it('should be defined', () => {
    expect(CredentialMapper).toBeDefined();
  });

  describe('toDomain', () => {
    it('should map raw credential to domain entity', () => {
      const rawCredential = generateSingleMockCredential();

      const credentialEntity = CredentialMapper.toDomain(rawCredential);

      expect(credentialEntity).toBeDefined();
      expect(credentialEntity.id.value).toEqual(rawCredential.id);
      expect(credentialEntity.userId.value).toEqual(rawCredential.userId);
      expect(credentialEntity.passwordHash).toEqual(rawCredential.passwordHash);
    });
  });
});

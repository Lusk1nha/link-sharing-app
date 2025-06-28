import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { ConfigService } from '@nestjs/config';
import { PasswordFactory } from 'src/common/entities/password/password.factory';

describe(PasswordService.name, () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService, ConfigService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Hashing Password', () => {
    it(`should be defined ${PasswordService.prototype.hashPassword.name}`, () => {
      expect(service.hashPassword).toBeDefined();
    });

    it('should hash a password', async () => {
      const password = 'testPassword';
      const hash = await service.hashPassword(PasswordFactory.from(password));
      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);
    });

    it('should hash the same password to different hashes', async () => {
      const password = 'testPassword';
      const hash1 = await service.hashPassword(PasswordFactory.from(password));
      const hash2 = await service.hashPassword(PasswordFactory.from(password));
      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('Comparing Passwords', () => {
    it(`should be defined ${PasswordService.prototype.comparePassword.name}`, () => {
      expect(service.comparePassword).toBeDefined();
    });

    it('should return true for matching password and hash', async () => {
      const password = 'testPassword';
      const hash = await service.hashPassword(PasswordFactory.from(password));
      const isMatch = await service.comparePassword(
        PasswordFactory.from(password),
        hash,
      );
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword';
      const wrongPassword = 'wrongPassword';
      const hash = await service.hashPassword(PasswordFactory.from(password));
      const isMatch = await service.comparePassword(
        PasswordFactory.from(wrongPassword),
        hash,
      );
      expect(isMatch).toBe(false);
    });
  });
});

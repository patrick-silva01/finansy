import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('Encrypted must be different from decrypted', async () => {
    const encrypt = await service.encrypt('data')
    expect(encrypt).not.toBe('data')
  })

  test('Encrypted length must be 16, 32 or 64', async () => {
    const encrypt = await service.encrypt('data')
    expect(encrypt.length % 16).toBe(0)
  })

  test('Encrypted and decrypted must match', async () => {
    const encrypted = await service.encrypt('data')
    const decrypted = await service.decrypt(encrypted)
    expect(decrypted).toBe('data')
  })
});

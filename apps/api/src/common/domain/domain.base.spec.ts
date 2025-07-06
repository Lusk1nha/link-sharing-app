import { DomainBaseMapper } from './domain.base';

describe(DomainBaseMapper.name, () => {
  class TestMapper extends DomainBaseMapper<unknown, unknown> {
    toDomain(raw: unknown): unknown {
      return raw;
    }

    toModel(entity: unknown): unknown {
      return entity;
    }
  }

  let mapper: TestMapper;

  beforeEach(() => {
    mapper = new TestMapper();
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  it('should convert raw to domain entity', () => {
    const raw = { id: 1, name: 'Test' };
    expect(mapper.toDomain(raw)).toEqual(raw);
  });

  it('should convert domain entity to raw', () => {
    const entity = { id: 1, name: 'Test' };
    expect(mapper.toModel(entity)).toEqual(entity);
  });
});

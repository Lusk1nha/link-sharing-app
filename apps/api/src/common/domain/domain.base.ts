export abstract class DomainBaseMapper<E, R = unknown> {
  /**
   * Converts a raw database record to a domain entity.
   * @param raw - The raw database record.
   * @returns The domain entity.
   */
  abstract toDomain(raw: R): E;

  /**
   * Converts a domain entity to a raw database record.
   * @param entity - The domain entity.
   * @returns The raw database record.
   */
  abstract toModel(entity: E);
}

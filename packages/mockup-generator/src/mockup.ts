export function generateMock<T>(
  factory: (index: number) => Partial<T>,
  count: number,
  override?: Partial<T>,
): T[] {
  return Array.from({ length: count }, (_, index) => ({
    ...factory(index),
    ...override,
  })) as T[];
}

export function generateSingleMock<T>(
  factory: () => Partial<T>,
  override?: Partial<T>,
): T {
  return {
    ...factory(),
    ...override,
  } as T;
}

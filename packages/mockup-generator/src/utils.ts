export class MockUtils {
  static generateMany<T>(generateOne: () => T, length: number): T[] {
    return Array.from({ length }, generateOne);
  }

  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static randomArrayElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex] as T;
  }
}

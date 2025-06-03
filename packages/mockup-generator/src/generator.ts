export abstract class BaseMockupGenerator<T> {
  protected abstract generateOne(): T;

  generateMany(length: number): T[] {
    return Array.from({ length }, () => this.generateOne());
  }
}

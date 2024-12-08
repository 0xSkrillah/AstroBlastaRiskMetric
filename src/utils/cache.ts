export class Cache<T> {
  private data: T | null = null;
  private timestamp: number = 0;
  private readonly ttl: number;

  constructor(ttlMs: number) {
    this.ttl = ttlMs;
  }

  set(value: T): void {
    this.data = value;
    this.timestamp = Date.now();
  }

  get(): T | null {
    if (!this.data || Date.now() - this.timestamp > this.ttl) {
      return null;
    }
    return this.data;
  }

  isValid(): boolean {
    return !!this.data && Date.now() - this.timestamp <= this.ttl;
  }
}
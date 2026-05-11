// @ts-nocheck
import { EventEmitter } from "events";

// Generic interface with constraints
interface Repository<T extends { id: string }> {
  find(id: string): T | null;
  save(item: T): Promise<void>;
  delete(id: string): Promise<boolean>;
}

// Type union with discriminated union pattern
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// Decorator example
function Memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  const cache = new Map();

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

// Class with generics and async methods
export class DataManager<T extends { id: string }> extends EventEmitter {
  private repository: Repository<T>;

  constructor(repository: Repository<T>) {
    super();
    this.repository = repository;
  }

  @Memoize
  async fetchData(id: string): Promise<ApiResponse<T | null>> {
    try {
      const item = this.repository.find(id);
      this.emit("dataFetched", item);
      return { status: "success", data: item };
    } catch (error) {
      return { status: "error", error: String(error) };
    }
  }

  async updateData(item: T): Promise<void> {
    await this.repository.save(item);
    this.emit("dataUpdated", item);
  }
}

// Conditional type utility
type Flatten<T> = T extends Array<infer U> ? U : T;
type Str = Flatten<string[]>; // string

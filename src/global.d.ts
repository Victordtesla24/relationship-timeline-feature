// Global type declarations for test files

declare namespace jest {
  interface Mock<T = any, Y extends any[] = any[]> {
    (...args: Y): T;
    mockReturnValue(value: T): this;
    mockResolvedValue(value: T): this;
    mockImplementation(fn: (...args: Y) => T): this;
    mockImplementationOnce(fn: (...args: Y) => T): this;
  }
  
  function fn<T = any>(): Mock<T>;
  function clearAllMocks(): void;
  
  interface Matchers<R> {
    any(value: any): any;
  }
  
  interface Expect {
    any(constructor: any): any;
  }
}

declare var global: {
  fetch: jest.Mock;
};

declare var window: Window & {
  confirm: jest.Mock;
};

declare function describe(name: string, fn: () => void): void;
declare namespace describe {
  function skip(name: string, fn: () => void): void;
}

declare function beforeEach(fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>, timeout?: number): void;
declare namespace it {
  function skip(name: string, fn: () => void | Promise<void>, timeout?: number): void;
}

declare function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
declare namespace test {
  function skip(name: string, fn: () => void | Promise<void>, timeout?: number): void;
}

declare function expect(actual: any): {
  toHaveClass(arg0: string): unknown;
  rejects: any;
  toBeInTheDocument(): void;
  toHaveValue(value: string): void;
  toHaveAttribute(name: string, value?: string): void;
  toBeVisible(): void;
  toBe(expected: any): void;
  toEqual(expected: any): void;
  toBeTruthy(): void;
  toHaveTextContent(text: string): void;
  not: {
    toHaveClass(arg0: string): unknown;
    toHaveBeenCalled(): unknown;
    toBeInTheDocument(): void;
    toHaveAttribute(name: string, value?: string): void;
  };
  toHaveBeenCalled(): void;
  toHaveBeenCalledTimes(count: number): void;
  toHaveBeenCalledWith(...args: any[]): void;
  any(constructor: any): any;
}; 

declare namespace expect {
  function any(constructor: any): any;
} 
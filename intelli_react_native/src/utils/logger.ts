type LogTag =
  | 'API'
  | 'SQLITE'
  | 'NETINFO'
  | 'AUTH'
  | 'NAVIGATION'
  | 'BOUNDARY'
  | 'RUNTIME'
  | 'PROMISE'
  | 'HOOK'
  | 'REPO';

export class Logger {
  private static timers: Map<string, number> = new Map();

  private static format(tag: LogTag, message: string): string {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    return `[${timestamp}] [${tag}] ${message}`;
  }

  static debug(tag: LogTag, message: string, payload?: unknown): void {
    if (__DEV__) {
      if (payload !== undefined) {
        console.debug(Logger.format(tag, message), payload);
      } else {
        console.debug(Logger.format(tag, message));
      }
    }
  }

  static info(tag: LogTag, message: string, payload?: unknown): void {
    if (__DEV__) {
      if (payload !== undefined) {
        console.info(Logger.format(tag, message), payload);
      } else {
        console.info(Logger.format(tag, message));
      }
    }
  }

  static warn(tag: LogTag, message: string, payload?: unknown): void {
    if (payload !== undefined) {
      console.warn(Logger.format(tag, message), payload);
    } else {
      console.warn(Logger.format(tag, message));
    }
  }

  static error(tag: LogTag, message: string, error?: unknown): void {
    console.error(Logger.format(tag, message), error);
  }

  /**
   * Benchmarks execution time for bulk SQLite operations or API calls.
   */
  static time(label: string): void {
    if (__DEV__) {
      Logger.timers.set(label, Date.now());
    }
  }

  static timeEnd(label: string): void {
    if (__DEV__) {
      const startTime = Logger.timers.get(label);
      if (startTime !== undefined) {
        const elapsed = Date.now() - startTime;
        Logger.timers.delete(label);
        console.log(`⏱️ [BENCHMARK] ${label}: ${elapsed}ms`);
      }
    }
  }
}

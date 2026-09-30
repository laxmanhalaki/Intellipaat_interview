export type ErrorCategory = 'NETWORK' | 'API' | 'DATABASE' | 'VALIDATION' | 'UNKNOWN';

export interface AppErrorOptions {
  category: ErrorCategory;
  userMessage: string;
  technicalMessage?: string;
  statusCode?: number;
  originalError?: unknown;
}

export class AppError extends Error {
  public readonly category: ErrorCategory;
  public readonly userMessage: string;
  public readonly technicalMessage: string;
  public readonly statusCode?: number;
  public readonly originalError?: unknown;
  public readonly timestamp: number;

  constructor(options: AppErrorOptions) {
    super(options.technicalMessage || options.userMessage);
    this.name = 'AppError';
    this.category = options.category;
    this.userMessage = options.userMessage;
    this.technicalMessage = options.technicalMessage || options.userMessage;
    this.statusCode = options.statusCode;
    this.originalError = options.originalError;
    this.timestamp = Date.now();
  }
}

export class NetworkError extends AppError {
  constructor(userMessage: string = 'No internet connection. Please check your network.', technical?: string) {
    super({ category: 'NETWORK', userMessage, technicalMessage: technical });
    this.name = 'NetworkError';
  }
}

export class DatabaseError extends AppError {
  constructor(userMessage: string = 'Local database operation failed.', technical?: string, original?: unknown) {
    super({ category: 'DATABASE', userMessage, technicalMessage: technical, originalError: original });
    this.name = 'DatabaseError';
  }
}

export class ApiError extends AppError {
  constructor(statusCode: number, userMessage: string, technical?: string) {
    super({ category: 'API', userMessage, technicalMessage: technical, statusCode });
    this.name = 'ApiError';
  }
}

export class ValidationError extends AppError {
  constructor(userMessage: string, technical?: string) {
    super({ category: 'VALIDATION', userMessage, technicalMessage: technical });
    this.name = 'ValidationError';
  }
}

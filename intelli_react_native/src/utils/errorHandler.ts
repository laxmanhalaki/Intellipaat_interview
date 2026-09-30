import { AppError } from '../types/errors';
import { Logger } from './logger';

export function normalizeError(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred.'
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      category: 'UNKNOWN',
      userMessage: fallbackMessage,
      technicalMessage: `${error.name}: ${error.message}\n${error.stack || ''}`,
      originalError: error,
    });
  }

  if (typeof error === 'string') {
    return new AppError({
      category: 'UNKNOWN',
      userMessage: fallbackMessage,
      technicalMessage: error,
    });
  }

  return new AppError({
    category: 'UNKNOWN',
    userMessage: fallbackMessage,
    technicalMessage: JSON.stringify(error),
    originalError: error,
  });
}

/**
 * Initializes global runtime crash interceptors.
 * Catches uncaught JS exceptions and unhandled promise rejections.
 */
export function initGlobalErrorHandlers(): void {
  // 1. Intercept uncaught synchronous JS exceptions
  const defaultHandler = (globalThis as any).ErrorUtils?.getGlobalHandler?.();
  if ((globalThis as any).ErrorUtils) {
    (globalThis as any).ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      Logger.error('RUNTIME', `Uncaught Exception (Fatal: ${isFatal})`, {
        message: error.message,
        stack: error.stack,
      });

      if (__DEV__ && defaultHandler) {
        // In development, preserve default redbox error screen
        defaultHandler(error, isFatal);
      }
    });
  }

  // 2. Intercept unhandled promise rejections
  try {
    const tracking = require('promise/setimmediate/rejection-tracking');
    tracking.enable({
      allRejections: true,
      onUnhandled: (id: string, error: Error) => {
        Logger.error('PROMISE', `Unhandled Promise Rejection [${id}]`, {
          message: error?.message,
          stack: error?.stack,
        });
      },
      onHandled: (id: string) => {
        Logger.info('PROMISE', `Promise Rejection Handled [${id}]`);
      },
    });
  } catch {
    // Rejection tracking fallback if environment does not support module
  }
}

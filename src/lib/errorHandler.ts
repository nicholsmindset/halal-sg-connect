export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp: Date;
  userId?: string;
  context?: Record<string, unknown>;
}

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errors: AppError[] = [];

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  logError(error: Error | AppError, context?: Record<string, unknown>): void {
    const appError: AppError = {
      message: error.message,
      timestamp: new Date(),
      context,
      ...(error instanceof Error ? {} : error),
    };

    this.errors.push(appError);
    console.error('App Error:', appError);

    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      this.sendToMonitoring(appError);
    }
  }

  private async sendToMonitoring(error: AppError): Promise<void> {
    try {
      const { logError } = await import('./sentry');
      logError(new Error(error.message), error.context);
    } catch {
      // Sentry not available, log locally
      console.log('Would send to monitoring:', error);
    }
  }

  getRecentErrors(limit = 10): AppError[] {
    return this.errors.slice(-limit);
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  AppErrorHandler.getInstance().logError(
    new Error(`Unhandled Promise Rejection: ${event.reason}`),
    { type: 'unhandledrejection' }
  );
});

// Global error handler for uncaught exceptions
window.addEventListener('error', event => {
  console.error('Uncaught error:', event.error);
  AppErrorHandler.getInstance().logError(event.error, {
    type: 'uncaught',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

export const errorHandler = AppErrorHandler.getInstance();

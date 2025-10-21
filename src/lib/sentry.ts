import * as Sentry from '@sentry/react';

export const initSentry = () => {
  // Only initialize in production or if DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_APP_ENV || 'development';

  if (!dsn) {
    console.log('Sentry DSN not configured, error monitoring disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0,

    // Release tracking
    release: `halal-sg-connect@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,

    // Ignore common errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'NetworkError',
    ],

    // Filtering sensitive data
    beforeSend(event, hint) {
      // Filter out sensitive information
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }

      return event;
    },
  });
};

export const logError = (error: Error, context?: Record<string, unknown>) => {
  if (import.meta.env.DEV) {
    console.error('Error:', error, 'Context:', context);
  }

  Sentry.captureException(error, {
    extra: context,
  });
};

export const logMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info'
) => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (user: {
  id: string;
  email?: string;
  username?: string;
}) => {
  Sentry.setUser(user);
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

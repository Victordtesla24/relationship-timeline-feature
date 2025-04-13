// monitoring.ts - Centralized error tracking and monitoring solution

/**
 * Simple monitoring utility for the relationship timeline application
 * In production, this would connect to services like Sentry, LogRocket, or New Relic
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Configuration - would come from environment variables in production
const config = {
  captureConsoleErrors: true,
  captureUnhandledPromises: true,
  captureUncaughtExceptions: true,
  logToConsole: isDevelopment,
  sendToServer: isProduction,
  samplingRate: 1.0, // 100% of errors
  serverEndpoint: '/api/monitoring', // Would be a real endpoint in production
};

// Core logging functionality
export const logError = (error: Error, context = {}) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  // Log to console in development
  if (config.logToConsole) {
    console.error('🔴 Monitoring Error:', errorData);
  }

  // In production, send to the server/monitoring service
  if (config.sendToServer) {
    try {
      // This would be an API call to your monitoring service
      // Example using fetch:
      if (typeof window !== 'undefined') {
        const sendBeacon = () => {
          navigator.sendBeacon(
            config.serverEndpoint,
            JSON.stringify(errorData)
          );
        };

        // Use sendBeacon for reliability, especially on page navigation
        if (navigator && 'sendBeacon' in navigator) {
          sendBeacon();
        } else {
          // Fallback to fetch
          fetch(config.serverEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorData),
            keepalive: true,
          }).catch(err => console.error('Failed to send error to server:', err));
        }
      }
    } catch (sendError) {
      // Don't cause additional errors when reporting
      if (config.logToConsole) {
        console.error('Failed to send error report:', sendError);
      }
    }
  }

  return errorData;
};

// User action tracking for analytics
export const trackUserAction = (action: string, data = {}) => {
  const actionData = {
    timestamp: new Date().toISOString(),
    action,
    data,
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  if (config.logToConsole) {
    console.log('👤 User Action:', actionData);
  }

  if (config.sendToServer) {
    // This would send to analytics in production
    // Example implementation omitted
  }

  return actionData;
};

// Performance monitoring
export const trackPerformance = (metric: string, duration: number, data = {}) => {
  const perfData = {
    timestamp: new Date().toISOString(),
    metric,
    duration,
    data,
  };

  if (config.logToConsole) {
    console.log('⏱️ Performance:', perfData);
  }

  if (config.sendToServer) {
    // This would send to performance monitoring in production
    // Example implementation omitted
  }

  return perfData;
};

// Setup global error handlers
export const setupGlobalErrorHandlers = () => {
  if (typeof window !== 'undefined') {
    // Handle uncaught exceptions
    if (config.captureUncaughtExceptions) {
      window.addEventListener('error', (event) => {
        logError(
          event.error || new Error(event.message),
          { type: 'uncaught_exception', lineNo: event.lineno, fileName: event.filename }
        );
      });
    }

    // Handle unhandled promise rejections
    if (config.captureUnhandledPromises) {
      window.addEventListener('unhandledrejection', (event) => {
        let error = event.reason;
        if (!(error instanceof Error)) {
          error = new Error(String(error));
        }
        logError(error, { type: 'unhandled_promise' });
      });
    }

    // Optionally capture console errors
    if (config.captureConsoleErrors) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        originalConsoleError.apply(console, args);
        
        // Only log actual errors
        const errorArg = args.find(arg => arg instanceof Error);
        if (errorArg) {
          logError(errorArg, { type: 'console_error' });
        }
      };
    }
  }
};

// Initialize monitoring
export const initMonitoring = () => {
  try {
    setupGlobalErrorHandlers();
    
    if (config.logToConsole) {
      console.log('✅ Monitoring initialized');
    }
    
    // Return a cleanup function
    return () => {
      // Cleanup would remove event listeners, etc.
      if (config.logToConsole) {
        console.log('❌ Monitoring cleanup');
      }
    };
  } catch (err) {
    // Failsafe - monitoring should never crash the app
    console.error('Failed to initialize monitoring:', err);
    return () => {}; // Return empty cleanup function
  }
};

// Define a named monitoring object that can be exported
const monitoringUtils = {
  logError,
  trackUserAction,
  trackPerformance,
  initMonitoring,
};

// Export the named monitoring object as default
export default monitoringUtils; 
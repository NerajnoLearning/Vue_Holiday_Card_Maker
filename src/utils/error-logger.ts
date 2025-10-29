export interface ErrorLog {
  timestamp: Date
  message: string
  stack?: string
  context?: Record<string, unknown>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100

  log(
    error: Error | string,
    severity: ErrorLog['severity'] = 'medium',
    context?: Record<string, unknown>
  ): void {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error !== 'string' ? error.stack : undefined,
      context,
      severity
    }

    this.logs.push(errorLog)

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger]', errorLog)
    }

    // In production, you could send to a logging service
    // this.sendToLoggingService(errorLog)
  }

  getLogs(): ReadonlyArray<ErrorLog> {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }

  getLogsBySeverity(severity: ErrorLog['severity']): ReadonlyArray<ErrorLog> {
    return this.logs.filter((log) => log.severity === severity)
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Helper method to handle common error scenarios
  handleError(
    error: unknown,
    userMessage: string,
    severity: ErrorLog['severity'] = 'medium',
    context?: Record<string, unknown>
  ): string {
    const errorMessage = error instanceof Error ? error.message : String(error)

    this.log(
      error instanceof Error ? error : new Error(errorMessage),
      severity,
      { ...context, userMessage }
    )

    return userMessage
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger()

// Convenience functions
export const logError = (
  error: Error | string,
  severity?: ErrorLog['severity'],
  context?: Record<string, unknown>
) => {
  errorLogger.log(error, severity, context)
}

export const handleError = (
  error: unknown,
  userMessage: string,
  severity?: ErrorLog['severity'],
  context?: Record<string, unknown>
) => {
  return errorLogger.handleError(error, userMessage, severity, context)
}

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: boolean
  onRetry?: (attempt: number, error: Error) => void
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options

  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        throw lastError
      }

      // Calculate delay with exponential backoff if enabled
      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay

      if (onRetry) {
        onRetry(attempt, lastError)
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, currentDelay))
    }
  }

  throw lastError!
}

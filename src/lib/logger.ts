const isProduction = process.env.NODE_ENV === 'production'

export function logError(context: string, error: unknown): void {
  if (isProduction) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[${context}] ${message}`)
  } else {
    console.error(`[${context}]`, error)
  }
}

export function logWarn(context: string, message: string): void {
  console.warn(`[${context}] ${message}`)
}

export function logInfo(context: string, message: string): void {
  if (!isProduction) {
    console.info(`[${context}] ${message}`)
  }
}

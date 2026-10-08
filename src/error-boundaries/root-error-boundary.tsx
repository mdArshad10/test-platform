import { ErrorBoundary, type FallbackProps } from "react-error-boundary"

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

interface RootErrorBoundaryProps {
  children: React.ReactNode
}

/**
 * Top-level error boundary — wraps the entire app.
 * Catches uncaught errors from any child tree.
 */
export function RootErrorBoundary({ children }: RootErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={DefaultFallback}
      onError={(error, info) => {
        // Replace with your error reporting service (e.g. Sentry)
        console.error("[RootErrorBoundary]", error, info)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}


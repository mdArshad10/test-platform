import { ErrorBoundary, type FallbackProps } from "react-error-boundary"

function RouteFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div role="alert">
      <p>Page error:</p>
      <pre>{message}</pre>
      <button onClick={resetErrorBoundary}>Reload page</button>
    </div>
  )
}

interface RouteErrorBoundaryProps {
  children: React.ReactNode
}

/**
 * Per-route error boundary — wrap individual routes to isolate failures.
 */
export function RouteErrorBoundary({ children }: RouteErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={RouteFallback}
      onError={(error, info) => {
        console.error("[RouteErrorBoundary]", error, info)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}


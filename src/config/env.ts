/**
 * Centralised environment variable access.
 * All env vars must be prefixed with VITE_ to be exposed to the client.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  appName: import.meta.env.VITE_APP_NAME ?? "App",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const


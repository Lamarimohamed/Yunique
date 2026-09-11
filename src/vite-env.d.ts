/// <reference types="vite/client" />

interface Window {
	fbq?: (command: "init" | "track", event: string, parameters?: Record<string, unknown>) => void
}

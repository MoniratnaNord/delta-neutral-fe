/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URL: string;
	readonly VITE_ENVIRONMENT: "dev" | "prod";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

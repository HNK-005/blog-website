/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_COOL_DOWN_RESEND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

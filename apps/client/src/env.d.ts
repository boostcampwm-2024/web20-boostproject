interface ImportMetaEnv {
  readonly VITE_MEDIASERVER_URL: string;
  readonly VITE_API_SERVER_URL: string;
  readonly VITE_CHAT_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

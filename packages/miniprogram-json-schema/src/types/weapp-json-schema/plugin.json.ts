export interface WeappPluginJson {
  publicComponents?: {
    [k: string]: string;
  };
  usingComponents?: {
    [k: string]: string;
  };
  pages?: {
    [k: string]: string;
  };
  main?: string;
  themeLocation?: string;
  lazyCodeLoading?: "requiredComponents";
  workers?: string;
  renderer?: "skyline" | "webview";
  componentFramework?: "exparser" | "glass-easel";
  [k: string]: unknown;
}

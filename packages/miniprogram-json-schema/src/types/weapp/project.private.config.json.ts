export interface WeappProjectPrivateConfigJson {
  projectArchitecture?: "miniProgram" | "mulitPlatform";
  libVersion?: ("" | "development" | "latest" | "trial" | "widelyUsed") | string;
  editorSetting?: {
    tabIndent?: "auto" | "insertSpaces" | "tab";
    tabSize?: "\t" | number;
    [k: string]: unknown;
  };
  cloudfunctionRoot?: string;
  cloudfunctionTemplateRoot?: string;
  cloudcontainerRoot?: string;
  srcMiniprogramRoot?: string;
  description?: string;
  simulatorType?: string;
  simulatorPluginLibVersion?: unknown;
  miniprogramRoot?: string;
  pluginRoot?: string;
  pluginAppid?: string;
  jsserverRoot?: string;
  projectname?: string;
  appid?: string;
  packOptions?: {
    ignore?: {
      type: string;
      value: string;
      [k: string]: unknown;
    }[];
    include?: {
      type: string;
      value: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
  watchOptions?: {
    ignore?: string[];
    [k: string]: unknown;
  };
  setting?: {
    autoAudits?: boolean;
    urlCheck?: boolean;
    compileHotReLoad?: boolean;
    preloadBackgroundData?: boolean;
    lazyloadPlaceholderEnable?: boolean;
    useStaticServer?: boolean;
    coverView?: boolean;
    ignoreDevUnusedFiles?: boolean;
    ignoreCodeQuality?: boolean;
    checkInvalidKey?: boolean;
    showShadowRootInWxmlPanel?: boolean;
    useIsolateContext?: boolean;
    useMultiFrameRuntime?: boolean;
    useApiHook?: boolean;
    useApiHostProcess?: boolean;
    useLanDebug?: boolean;
    enableEngineNative?: boolean;
    showES6CompileOption?: boolean;
    [k: string]: unknown;
  };
  staticServerOptions?: {
    servePath?: string;
    [k: string]: unknown;
  };
  condition?: {
    game?: {
      current?: number;
      list?: {
        name?: string;
        pathName?: string;
        query?: string;
        scene?: null | string | number;
        shareInfo?: unknown;
        referrerInfo?: unknown;
        chatroomUsernameInfo?: unknown;
        groupInfo?: unknown;
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    gamePlugin?: {
      current?: number;
      list?: {
        name?: string;
        query?: string;
        scene?: null | string | number;
        shareInfo?: unknown;
        referrerInfo?: unknown;
        groupInfo?: unknown;
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    plugin?: {
      current?: number;
      list?: {
        name?: string;
        pathName?: string;
        query?: string;
        launchMode?: string;
        scene?: null | string | number;
        shareInfo?: unknown;
        referrerInfo?: unknown;
        groupInfo?: unknown;
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    miniprogram?: {
      current?: number;
      list?: {
        name?: string;
        pathName?: string;
        query?: string;
        launchMode?: string;
        scene?: null | string | number;
        partialCompile?: {
          enabled?: boolean;
          pages?: unknown[];
          [k: string]: unknown;
        };
        shareInfo?: unknown;
        referrerInfo?: unknown;
        chatroomUsernameInfo?: unknown;
        groupInfo?: unknown;
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

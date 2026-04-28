export interface WeappProjectConfigJson {
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
  qcloudRoot?: string;
  pluginRoot?: string;
  cloudbaseRoot?: string;
  compileType?: string;
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
    es6?: boolean;
    enhance?: boolean;
    postcss?: boolean;
    minified?: boolean;
    minifyWXSS?: boolean;
    minifyWXML?: boolean;
    uglifyFileName?: boolean;
    ignoreUploadUnusedFiles?: boolean;
    ignoreCodeQuality?: boolean;
    autoAudits?: boolean;
    urlCheck?: boolean;
    compileHotReLoad?: boolean;
    preloadBackgroundData?: boolean;
    lazyloadPlaceholderEnable?: boolean;
    useStaticServer?: boolean;
    babelSetting?: {
      outputPath?: string;
      ignore?: string[];
      disablePlugins?: unknown[];
      [k: string]: unknown;
    };
    useCompilerPlugins?: ("less" | "sass" | "typescript")[] | false;
    disableUseStrict?: boolean;
    uploadWithSourceMap?: boolean;
    localPlugins?: boolean;
    packNpmManually?: boolean;
    packNpmRelationList?: {
      packageJsonPath: string;
      miniprogramNpmDistDir: string;
      [k: string]: unknown;
    }[];
    coverView?: boolean;
    ignoreDevUnusedFiles?: boolean;
    checkInvalidKey?: boolean;
    showShadowRootInWxmlPanel?: boolean;
    useIsolateContext?: boolean;
    useMultiFrameRuntime?: boolean;
    useApiHook?: boolean;
    useApiHostProcess?: boolean;
    useLanDebug?: boolean;
    enableEngineNative?: boolean;
    showES6CompileOption?: boolean;
    minifyWXMLSetting?: {
      global: {
        collapseWhitespace?: boolean;
        conservativeCollapse?: boolean;
        preserveLineBreaks?: boolean;
        [k: string]: unknown;
      };
      [k: string]: {
        collapseWhitespace?: boolean;
        conservativeCollapse?: boolean;
        preserveLineBreaks?: boolean;
        [k: string]: unknown;
      };
    };
    [k: string]: unknown;
  };
  staticServerOptions?: {
    servePath?: string;
    [k: string]: unknown;
  };
  scripts?: {
    beforeCompile?: string;
    beforePreview?: string;
    beforeUpload?: string;
    [k: string]: unknown;
  };
  debugOptions?: {
    hideInDevtools?: string[];
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
  skeletonConfig?: {
    global: ISkeletonConfig;
    [k: string]: ISkeletonConfig;
  };
  [k: string]: unknown;
}
export interface ISkeletonConfig {
  loading?: "" | "chiaroscuro" | "shine" | "spin";
  outline?: {
    remain: boolean;
    replace: string;
    [k: string]: unknown;
  };
  text?: {
    color: string;
    [k: string]: unknown;
  };
  image?: {
    color: string;
    shape: "circle" | "rect";
    shapeOpposite: string[];
    [k: string]: unknown;
  };
  button?: {
    color: string;
    excludes: string[];
    [k: string]: unknown;
  };
  pseudo?: {
    color: string;
    shape: "circle" | "rect";
    [k: string]: unknown;
  };
  excludes?: string[];
  remove?: string[];
  grayBlock?: string[];
  showNative?: boolean;
  backgroundColor?: string;
  mode?: "auto" | "fullscreen";
  templateName?: string;
  cssUnit?: "rem" | "rpx" | "vh" | "vmax" | "vmin" | "vw";
  decimal?: number;
  [k: string]: unknown;
}

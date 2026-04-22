export interface WeappExtJson {
  extAppid: string;
  extEnable?: boolean;
  directCommit?: boolean;
  ext?: {
    [k: string]: unknown;
  };
  extPages?: {
    [k: string]: IPageJSON;
  };
  __warning__?: string;
  pages?: string[];
  window?: IWindow;
  plugins?: {
    [k: string]: IPluginConfig;
  };
  entryPagePath?: string;
  permission?: {
    "scope.userLocation"?: {
      desc: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  workers?:
    | {
        path: string;
        isSubpackage: boolean;
        [k: string]: unknown;
      }
    | string;
  subPackages?: ISubPackageItem[];
  subpackages?: ISubPackageItem[];
  preloadRule?: {
    [k: string]: {
      network?: "all" | "wifi";
      packages: string[];
      [k: string]: unknown;
    };
  };
  usingComponents?: {
    [k: string]: string;
  };
  componentPlaceholder?: {
    [k: string]: string;
  };
  tabBar?: ITabBar;
  requiredBackgroundModes?: string[];
  mimeTypeDeclarations?: {
    [k: string]: string[];
  };
  networkTimeout?: {
    request?: number;
    connectSocket?: number;
    uploadFile?: number;
    downloadFile?: number;
    [k: string]: unknown;
  };
  debug?: boolean;
  resizable?: boolean;
  functionalPages?:
    | {
        independent: boolean;
        [k: string]: unknown;
      }
    | boolean;
  cloud?: boolean;
  openLocationPagePath?: string;
  sitemapLocation?: string;
  serviceProviderTicket?: string;
  style?: "v2";
  useExtendedLib?: {
    [k: string]: boolean;
  };
  entranceDeclare?: {
    locationMessage?: {
      path?: string;
      query?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  darkmode?: boolean;
  themeLocation?: string;
  theme?: string;
  enablePassiveEvent?:
    | {
        [k: string]: boolean;
      }
    | boolean;
  lazyCodeLoading?: "requiredComponents";
  requiredPrivateInfos?: (
    | "chooseAddress"
    | "chooseLocation"
    | "choosePoi"
    | "getFuzzyLocation"
    | "getLocation"
    | "onLocationChange"
    | "startLocationUpdate"
    | "startLocationUpdateBackground"
  )[];
  [k: string]: unknown;
}
export interface IPageJSON {
  pageJSONLight?: IOriginalPageJSON;
  pageJSONDark?: IOriginalPageJSON;
  enablePassiveEvent?:
    | {
        [k: string]: boolean;
      }
    | boolean;
  style?: "v2";
  componentPlaceholder?: {
    [k: string]: string;
  };
  "mini-ios"?: IOriginalPageJSON;
  "mini-android"?: IOriginalPageJSON;
  "mini-weixin"?: IOriginalPageJSON;
  disableScroll?: boolean;
  disableSwipeBack?: boolean;
  usingComponents?: {
    [k: string]: string;
  };
  renderer?: "cover-view" | "skyline" | "webview" | "xr-frame";
  rendererOptions?: {
    skyline?: {
      disableABTest?: boolean;
      sdkVersionBegin?: string;
      sdkVersionEnd?: string;
      iosVersionBegin?: string;
      iosVersionEnd?: string;
      androidVersionBegin?: string;
      androidVersionEnd?: string;
      [k: string]: unknown;
    } & ISkylineFeatures;
    [k: string]: unknown;
  };
  component?: boolean;
  componentGenerics?: {
    [k: string]:
      | {
          default: string;
          [k: string]: unknown;
        }
      | true
      | null;
  };
  singlePage?: {
    navigationBarFit?: "float" | "squeezed";
    [k: string]: unknown;
  };
  componentFramework?: "exparser" | "glass-easel";
  styleIsolation?:
    | "apply-shared"
    | "isolated"
    | "page-apply-shared"
    | "page-isolated"
    | "page-shared"
    | "shared";
  pureDataPattern?: string;
  backgroundColorTop?: string;
  backgroundColorBottom?: string;
  backgroundColorContent?: string;
  backgroundColor?: string;
  enablePullDownRefresh?: boolean;
  navigationBarTextStyle?: ("black" | "white") | string;
  navigationBarTitleText?: string;
  navigationStyle?: "custom" | "default";
  backgroundTextStyle?: ("dark" | "light") | string;
  onReachBottomDistance?: number;
  pageOrientation?: "auto" | "landscape" | "portrait";
  navigationBarBackgroundColor?: string;
  renderingMode?: "mixed" | "seperated";
  restartStrategy?: "homePage" | "homePageAndLatestPage";
  visualEffectInBackground?: "hidden" | "none";
  initialRenderingCache?: "capture" | "dynamic" | "static";
  handleWebviewPreload?: "auto" | "manual" | "static";
  homeButton?: boolean;
  [k: string]: unknown;
}
export interface IOriginalPageJSON {
  disableScroll?: boolean;
  disableSwipeBack?: boolean;
  usingComponents?: {
    [k: string]: string;
  };
  renderer?: "cover-view" | "skyline" | "webview" | "xr-frame";
  rendererOptions?: {
    skyline?: {
      disableABTest?: boolean;
      sdkVersionBegin?: string;
      sdkVersionEnd?: string;
      iosVersionBegin?: string;
      iosVersionEnd?: string;
      androidVersionBegin?: string;
      androidVersionEnd?: string;
      [k: string]: unknown;
    } & ISkylineFeatures;
    [k: string]: unknown;
  };
  component?: boolean;
  componentGenerics?: {
    [k: string]:
      | {
          default: string;
          [k: string]: unknown;
        }
      | true
      | null;
  };
  singlePage?: {
    navigationBarFit?: "float" | "squeezed";
    [k: string]: unknown;
  };
  componentFramework?: "exparser" | "glass-easel";
  styleIsolation?:
    | "apply-shared"
    | "isolated"
    | "page-apply-shared"
    | "page-isolated"
    | "page-shared"
    | "shared";
  pureDataPattern?: string;
  backgroundColorTop?: string;
  backgroundColorBottom?: string;
  backgroundColorContent?: string;
  backgroundColor?: string;
  enablePullDownRefresh?: boolean;
  navigationBarTextStyle?: ("black" | "white") | string;
  navigationBarTitleText?: string;
  navigationStyle?: "custom" | "default";
  backgroundTextStyle?: ("dark" | "light") | string;
  onReachBottomDistance?: number;
  pageOrientation?: "auto" | "landscape" | "portrait";
  navigationBarBackgroundColor?: string;
  renderingMode?: "mixed" | "seperated";
  restartStrategy?: "homePage" | "homePageAndLatestPage";
  visualEffectInBackground?: "hidden" | "none";
  initialRenderingCache?: "capture" | "dynamic" | "static";
  handleWebviewPreload?: "auto" | "manual" | "static";
  homeButton?: boolean;
  [k: string]: unknown;
}
export interface ISkylineFeatures {
  defaultContentBox?: boolean;
  defaultDisplayBlock?: boolean;
  [k: string]: unknown;
}
export interface IWindow {
  backgroundColorTop?: string;
  backgroundColorBottom?: string;
  backgroundColorContent?: string;
  backgroundColor?: string;
  enablePullDownRefresh?: boolean;
  navigationBarTextStyle?: ("black" | "white") | string;
  navigationBarTitleText?: string;
  navigationStyle?: "custom" | "default";
  backgroundTextStyle?: ("dark" | "light") | string;
  onReachBottomDistance?: number;
  pageOrientation?: "auto" | "landscape" | "portrait";
  navigationBarBackgroundColor?: string;
  renderingMode?: "mixed" | "seperated";
  restartStrategy?: "homePage" | "homePageAndLatestPage";
  visualEffectInBackground?: "hidden" | "none";
  initialRenderingCache?: "capture" | "dynamic" | "static";
  handleWebviewPreload?: "auto" | "manual" | "static";
  homeButton?: boolean;
  [k: string]: unknown;
}
export interface IPluginConfig {
  provider: string;
  version: string;
  path?: string;
  export?: string;
  genericsImplementation?: {
    [k: string]: {
      [k: string]: string;
    };
  };
  [k: string]: unknown;
}
export interface ISubPackageItem {
  independent?: boolean;
  name?: string;
  entry?: string;
  root: string;
  pages: string[];
  plugins?: {
    [k: string]: IPluginConfig;
  };
  useExtendedLib?: {
    [k: string]: string | boolean;
  };
  [k: string]: unknown;
}
export interface ITabBar {
  custom?: boolean;
  list: {
    pagePath: string;
    text?: string;
    iconPath?: string;
    selectedIconPath?: string;
    renderer?: "cover-view" | "skyline" | "webview";
    [k: string]: unknown;
  }[];
  borderStyle?: ("black" | "white") | string;
  position?: "bottom" | "top";
  color?: string;
  selectedColor?: string;
  backgroundColor?: string;
  [k: string]: unknown;
}

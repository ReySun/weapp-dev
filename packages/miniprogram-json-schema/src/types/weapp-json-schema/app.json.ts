export type IPlatform = "mini-android" | "mini-ios" | "mini-weixin";

export interface WeappAppJson {
  pages: string[];
  static?: IAppJSONStaticConfig[];
  "mini-ios"?: IOriginAppJSON & {
    pages?: string[];
    [k: string]: unknown;
  };
  "mini-android"?: IOriginAppJSON & {
    pages?: string[];
    [k: string]: unknown;
  };
  "mini-weixin"?: IOriginAppJSON & {
    pages?: string[];
    [k: string]: unknown;
  };
  __warning__?: string;
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
    "scope.userFuzzyLocation"?: {
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
  chatTools?: {
    root: string;
    entryPagePath: string;
    desc: string;
    scopes?: string[];
    [k: string]: unknown;
  }[];
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
  appBar?: IAppBar;
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
  displayMode?: "desktop" | "mobile" | "pad";
  frameset?: boolean;
  functionalPages?:
    | {
        independent: boolean;
        [k: string]: unknown;
      }
    | boolean;
  cloud?: boolean;
  cloudVersion?: string;
  cloudConfig?: {
    gatewayDomain?: string;
    publicKey?: string;
    gatewayId?: string;
    [k: string]: unknown;
  };
  openDataContext?: string;
  openLocationPagePath?: string;
  sitemapLocation?: string;
  serviceProviderTicket?: string;
  style?: "v2";
  useExtendedLib?: {
    [k: string]: string | boolean;
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
  singlePage?: {
    navigationBarFit?: "float" | "squeezed";
    [k: string]: unknown;
  };
  /**
   * 小程序按需注入
   *
   * https://developers.weixin.qq.com/miniprogram/dev/framework/ability/lazyload.html
   */
  lazyCodeLoading?: "requiredComponents";
  lazyCodeLoadingLegacy?: boolean;
  enablePassiveEvent?:
    | {
        [k: string]: boolean;
      }
    | boolean;
  requireBackgroundModes?: string[];
  embeddedAppIdList?: string[];
  renderer?: "skyline" | "webview";
  resolveAlias?: {
    [k: string]: string;
  };
  debugOptions?: {
    enableFPSPanel?: boolean;
    [k: string]: unknown;
  };
  halfPage?: {
    firstPageNavigationStyle?: "custom" | "default";
    [k: string]: unknown;
  };
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
  rendererOptions?: {
    defaultDisplayBlock?: boolean;
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
  componentFramework?: "exparser" | "glass-easel";
  accountCardPackage?: {
    root: string;
    cardList: {
      type: number;
      componentPath: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
  xrEntryPagePath?: string;
  miniApp?: {
    useAuthorizePage?: boolean;
    [k: string]: unknown;
  };
  __usePrivacyCheck__?: boolean;
  keepContextPageInCycleJump?: boolean;
  [k: string]: unknown;
}
export interface IAppJSONStaticConfig {
  pattern: string;
  platforms: IPlatform[];
  [k: string]: unknown;
}
export interface IOriginAppJSON {
  __warning__?: string;
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
    "scope.userFuzzyLocation"?: {
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
  chatTools?: {
    root: string;
    entryPagePath: string;
    desc: string;
    scopes?: string[];
    [k: string]: unknown;
  }[];
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
  appBar?: IAppBar;
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
  displayMode?: "desktop" | "mobile" | "pad";
  frameset?: boolean;
  functionalPages?:
    | {
        independent: boolean;
        [k: string]: unknown;
      }
    | boolean;
  cloud?: boolean;
  cloudVersion?: string;
  cloudConfig?: {
    gatewayDomain?: string;
    publicKey?: string;
    gatewayId?: string;
    [k: string]: unknown;
  };
  openDataContext?: string;
  openLocationPagePath?: string;
  sitemapLocation?: string;
  serviceProviderTicket?: string;
  style?: "v2";
  useExtendedLib?: {
    [k: string]: string | boolean;
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
  singlePage?: {
    navigationBarFit?: "float" | "squeezed";
    [k: string]: unknown;
  };
  /**
   * 小程序按需注入
   *
   * https://developers.weixin.qq.com/miniprogram/dev/framework/ability/lazyload.html
   */
  lazyCodeLoading?: "requiredComponents";
  lazyCodeLoadingLegacy?: boolean;
  enablePassiveEvent?:
    | {
        [k: string]: boolean;
      }
    | boolean;
  requireBackgroundModes?: string[];
  embeddedAppIdList?: string[];
  renderer?: "skyline" | "webview";
  resolveAlias?: {
    [k: string]: string;
  };
  debugOptions?: {
    enableFPSPanel?: boolean;
    [k: string]: unknown;
  };
  halfPage?: {
    firstPageNavigationStyle?: "custom" | "default";
    [k: string]: unknown;
  };
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
  rendererOptions?: {
    defaultDisplayBlock?: boolean;
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
  componentFramework?: "exparser" | "glass-easel";
  accountCardPackage?: {
    root: string;
    cardList: {
      type: number;
      componentPath: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
  xrEntryPagePath?: string;
  miniApp?: {
    useAuthorizePage?: boolean;
    [k: string]: unknown;
  };
  __usePrivacyCheck__?: boolean;
  keepContextPageInCycleJump?: boolean;
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
export interface IAppBar {
  custom?: boolean;
  [k: string]: unknown;
}
export interface ISkylineFeatures {
  defaultContentBox?: boolean;
  defaultDisplayBlock?: boolean;
  [k: string]: unknown;
}

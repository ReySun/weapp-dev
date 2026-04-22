export interface WeappGameJson {
  deviceOrientation?: "landscape" | "landscapeLeft" | "landscapeRight" | "portrait";
  networkTimeout?: {
    request?: number;
    connectSocket?: number;
    uploadFile?: number;
    downloadFile?: number;
    [k: string]: unknown;
  };
  openDataContext?: string;
  showStatusBar?: boolean;
  workers?:
    | {
        path: string;
        isSubpackage: boolean;
        [k: string]: unknown;
      }
    | string;
  disableSetUserStorageFromMiniProgram?: boolean;
  permission?: {
    "scope.userLocation"?: {
      desc: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  subPackages?: ISubPackageItem[];
  subpackages?: ISubPackageItem[];
  loadingImageInfo?: {
    path: string;
    progressBarColor?: string;
    [k: string]: unknown;
  };
  plugins?: {
    [k: string]: IPluginConfig;
  };
  resizable?: boolean;
  lockStepOptions?: {
    gameTick?: number;
    heartBeatTick?: number;
    offlineTimeLength?: number;
    UDPReliabilityStrategy?: number;
    dataType?: "ArrayBuffer" | "String";
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface ISubPackageItem {
  independent?: boolean;
  name?: string;
  root: string;
  plugins?: {
    [k: string]: IPluginConfig;
  };
  [k: string]: unknown;
}
export interface IPluginConfig {
  provider: string;
  version: string;
  path?: string;
  contexts?: {
    type: "gameContext" | "isolatedContext" | "openDataContext";
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

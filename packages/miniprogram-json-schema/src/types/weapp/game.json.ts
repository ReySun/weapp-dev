export interface WeappGameJson {
  deviceOrientation?: "landscape" | "landscapeLeft" | "landscapeRight" | "portrait";
  networkTimeout?: {
    request?: number;
    connectSocket?: number;
    uploadFile?: number;
    downloadFile?: number;
  };
  openDataContext?: string;
  showStatusBar?: boolean;
  workers?:
    | {
        path: string;
        isSubpackage: boolean;
      }
    | string;
  disableSetUserStorageFromMiniProgram?: boolean;
  permission?: {
    "scope.userLocation"?: {
      desc: string;
    };
  };
  subPackages?: ISubPackageItem[];
  subpackages?: ISubPackageItem[];
  loadingImageInfo?: {
    path: string;
    progressBarColor?: string;
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
  };
}
export interface ISubPackageItem {
  independent?: boolean;
  name?: string;
  root: string;
  plugins?: {
    [k: string]: IPluginConfig;
  };
}
export interface IPluginConfig {
  provider: string;
  version: string;
  path?: string;
  contexts?: {
    type: "gameContext" | "isolatedContext" | "openDataContext";
  }[];
}

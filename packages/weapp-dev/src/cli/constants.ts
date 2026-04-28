export enum BuildTaskTypeEnum {
  npm = "npm",
  wxss = "wxss",
  wxml = "wxml",
  copy = "copy",
  ts = "ts",
}

export interface BuildOptions {
  empty?: boolean;
}

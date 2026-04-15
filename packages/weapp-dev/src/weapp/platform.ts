import { WeappDevContext } from "@/utils/context/initContext";

export type WeappPlatform = "weapp" | "alipay" | "tt";

export enum WxWeappFinalExtEnum {
  wxml = "wxml",
  wxss = "wxss",
  js = "js",
  json = "json",
}

export enum AliWeappFinalExtEnum {
  wxml = "axml",
  wxss = "less",
  js = "js",
  json = "json",
}

export enum TtWeappFinalExtEnum {
  wxml = "ttml",
  wxss = "ttss",
  js = "js",
  json = "json",
}

export const WeappFinalFileExts: Record<
  WeappPlatform,
  Record<keyof typeof WxWeappFinalExtEnum, string>
> = {
  weapp: WxWeappFinalExtEnum,
  alipay: AliWeappFinalExtEnum,
  tt: TtWeappFinalExtEnum,
};

export async function getWeappFileFinalExtensions() {
  const { platform } = WeappDevContext.config;
  return WeappFinalFileExts[platform];
}

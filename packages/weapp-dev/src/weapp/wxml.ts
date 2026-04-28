import { WeappDevContext } from "@/config/mergedConfig";

import { WeappFinalFileExts } from "./platform";

/**
 * 获取所有 WXML 文件 glob 模式
 * @returns
 */
export async function getAllWxmlGlobPattern() {
  const { srcRoot } = WeappDevContext.config;

  const wxml = getAllWxmlExts();

  return `${srcRoot}/**/*.{${wxml.join(",")}}`;
}

/**
 * 获取所有 WXML 文件扩展名
 * @returns
 */
export function getAllWxmlExts() {
  const wxml: string[] = [];

  for (const key in WeappFinalFileExts) {
    if (!Object.hasOwn(WeappFinalFileExts, key)) continue;

    const element = WeappFinalFileExts[key];
    wxml.push(element.wxml);
  }

  return wxml;
}

/**
 * 微信小程序原生组件
 */
export const weappNativeComponents = [
  "wxs",
  "template",
  "block",
  "import",
  "include",
  "cover-image",
  "cover-view",
  "match-media",
  "movable-area",
  "movable-view",
  "page-container",
  "root-portal",
  "scroll-view",
  "swiper",
  "swiper-item",
  "view",
  "icon",
  "progress",
  "rich-text",
  "selection",
  "text",
  "button",
  "checkbox",
  "checkbox-group",
  "editor",
  "editor-portal",
  "form",
  "input",
  "keyboard-accessory",
  "label",
  "picker",
  "picker-view",
  "picker-view-column",
  "radio",
  "radio-group",
  "slider",
  "switch",
  "textarea",
  "double-tap-gesture-handler",
  "force-press-gesture-handler",
  "horizontal-drag-gesture-handler",
  "long-press-gesture-handler",
  "pan-gesture-handler",
  "scale-gesture-handler",
  "tap-gesture-handler",
  "vertical-drag-gesture-handler",
  "draggable-sheet",
  "grid-builder",
  "grid-view",
  "list-builder",
  "list-view",
  "nested-scroll-body",
  "nested-scroll-header",
  "open-container",
  "open-data-item",
  "open-data-list",
  "share-element",
  "snapshot",
  "span",
  "sticky-header",
  "sticky-section",
  "functional-page-navigator",
  "navigator",
  "audio",
  "camera",
  "channel-live",
  "channel-video",
  "image",
  "live-player",
  "live-pusher",
  "video",
  "voip-room",
  "map",
  "canvas",
  "ad",
  "ad-custom",
  "official-account",
  "official-account-publish",
  "open-data",
  "store-coupon",
  "store-gift",
  "store-home",
  "store-product",
  "web-view",
  "native-component",
  "aria-component",
  "navigation-bar",
  "page-meta",
  "slot",
];

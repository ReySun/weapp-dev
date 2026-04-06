const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{wxml,wxss,less}"],
  theme: {
    colors: {
      transparent: "transparent",
      theme: {
        100: "#FEF2F2",
        200: "#fee2e0",
        300: "#fcc8c3",
        400: "#f69e96",
        500: "#e2281a",
        600: "#c92217",
        700: "#a61d13",
        800: "#83180f",
        900: "#60120b",
        DEFAULT: "#e2281a",
      },
      white: "#ffffff",
      black: "#000000",
      // 背景色
      bg: {
        600: "#F2F3F5",
        900: "#E7E9EB",
        DEFAULT: "#F7F8FAFF",
      },

      red: {
        // 首页搜索红
        homeBg: "#fc1d23",
      },

      success: "#15bb66",
      warning: "#f49f25",
      danger: {
        100: "#fff7f7",
        200: "#fde3e3",
        DEFAULT: "#f03c3c",
      },

      // 链接
      link: "#007bff",
      // 主色/次色/辅助色
      main: "#333333",
      sec: "#696460",
      aux: "#96989a",

      // 图标默认颜色
      icon: "#7e7e85",

      // 边框
      border: "#e7e8ea",
      // 虚线
      dashed: "#eee7e2",
      // 分割线
      divider: "#f9f6f4",

      // 骨架屏颜色
      skeleton: "#e2e8f0",

      mask: "rgba(0, 0, 0, 0.8)",

      text: {
        placeholder: "#b4b4be",
      },
      shadow: {
        base: "",
      },
      spacing: {
        xss: "4px",
        xs: "8px",
        sm: "12px",
        base: "16px",
        lg: "24px",
        xl: "32px",
      },
    },
    extend: {
      backgroundImage: {
        "detail-gradient": "linear-gradient(270deg, #fefcf8 0%, #f6fcfc 100%)",
      },
      fontFamily: {
        number: "DINCond",
      },
      padding: {
        safe: "env(safe-area-inset-bottom)",
      },
      rotate: {
        flip: "180deg",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".ellipsis": {
          overflow: "hidden",
          "white-space": "nowrap",
          "text-overflow": "ellipsis",
        },
        ".ellipsis-2": {
          display: "-webkit-box",
          overflow: "hidden",
          "-webkit-line-clamp": "2",
          "-webkit-box-orient": "vertical",
          "text-overflow": "ellipsis",
        },
        ".flex-center": {
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        },
        ".empty-placeholder": {
          "&:empty::after": {
            content: '"-"',
          },
          ":empty::after": {
            content: '"-"',
          },
        },
        ".bg-no": {
          background: "none",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
      });
    }),
  ],
  corePlugins: {
    // 不需要透明度，浪费文件大小
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    textOpacity: false,
    // 禁用预定义样式，避免与小程序样式冲突
    preflight: false,
    container: false,
  },
};

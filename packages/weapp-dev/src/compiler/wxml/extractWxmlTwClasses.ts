import { parse } from "node-html-parser";

const isClassLike = (key: string) =>
  key.toLowerCase().endsWith("class") || key.toLowerCase().startsWith("class");

export function extractWxmlTwClasses(wxml: string) {
  const root = parse(wxml, {
    lowerCaseTagName: false,
    comment: false,
  });

  const classes = new Set<string>();

  const addClasses = (value: string) => {
    if (!value) return;

    // 1️⃣ 去掉 {{ }}，保留空格避免粘连
    const cleaned = value.replace(/\{\{[^}]*\}\}/g, " ");

    // 2️⃣ 提取静态 class
    const list = cleaned.split(/\s+/);
    for (let i = 0; i < list.length; i++) {
      const cls = list[i];
      if (cls) classes.add(cls);
    }

    // 3️⃣ 额外提取 {{}} 里的字符串字面量（可选但很有用）
    // 例如: {{ active ? 'bg-red-500' : 'bg-blue-500' }}
    const dynamicMatches = value.match(/['"`]([^'"`]+)['"`]/g);
    if (dynamicMatches) {
      for (let i = 0; i < dynamicMatches.length; i++) {
        const str = dynamicMatches[i].slice(1, -1);
        const inner = str.split(/\s+/);
        for (let j = 0; j < inner.length; j++) {
          const c = inner[j];
          if (c) classes.add(c);
        }
      }
    }
  };

  const walk = (node: any) => {
    if (node.nodeType === 1) {
      const attrs = node.attributes;

      for (const key in attrs) {
        if (!isClassLike(key)) continue;

        addClasses(attrs[key]);
      }
    }

    const children = node.childNodes;
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        walk(children[i]);
      }
    }
  };

  walk(root);

  return classes;
}

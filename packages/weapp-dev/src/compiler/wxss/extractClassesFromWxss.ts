import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

export function extractClassesFromWxss(css: string) {
  const set = new Set<string>();

  const root = postcss.parse(css);

  root.walkRules((rule) => {
    if (!rule.selector) return;

    selectorParser((selectors) => {
      selectors.walkClasses((node) => {
        // node.value 已经是干净的 class（自动处理转义）
        set.add(node.value);
      });
    }).processSync(rule.selector);
  });

  return set;
}

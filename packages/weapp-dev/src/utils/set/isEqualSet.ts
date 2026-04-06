export function isEqualSet(a: Set<string>, b: Set<string>) {
  if (!(a instanceof Set) || !(b instanceof Set)) {
    return false;
  }

  // 同引用直接返回
  if (a === b) return true;

  if (a.size !== b.size) return false;

  for (const item of a) {
    if (!b.has(item)) return false;
  }

  return true;
}

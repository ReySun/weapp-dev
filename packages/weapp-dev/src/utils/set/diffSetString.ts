export function diffSetString(a: Set<string>, b: Set<string>) {
  const onlyInA: string[] = [];

  if (!b) {
    return [...a];
  }

  for (const item of a) {
    if (!b.has(item)) {
      onlyInA.push(item);
    }
  }

  return onlyInA;
}

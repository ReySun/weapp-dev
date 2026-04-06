export async function runTimeEnd(cb: () => void | Promise<void>) {
  const start = Date.now();
  await cb();
  return Date.now() - start;
}

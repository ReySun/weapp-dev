export async function runTimeEnd(cb: () => any | Promise<any>) {
  const start = Date.now();
  await cb();
  return Date.now() - start;
}

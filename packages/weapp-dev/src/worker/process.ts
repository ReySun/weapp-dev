import { compileAllTs } from "@/compiler/typescript/compileTs";
import { compileAllWxss } from "@/compiler/wxss/compileWxss";
import { initWeappDevContext } from "@/config/mergedConfig";

import { type WorkerTaskType, type WorkerTaskPayload, WorkerTaskEnum } from "./types";

const taskMap: {
  [K in WorkerTaskType]: (payload: WorkerTaskPayload<K>) => Promise<void>;
} = {
  async [WorkerTaskEnum.buildAllWxss]() {
    await compileAllWxss();
  },
  async [WorkerTaskEnum.buildAllTs]() {
    await initWeappDevContext();
    await compileAllTs();
  },
  async [WorkerTaskEnum.exit]() {
    process.send?.({ type: "exit" });
    process.exit(2);
  },
};

process.on("message", async (msg) => {
  const { type, payload } = msg as {
    type: WorkerTaskType;
    payload: any;
  };

  // console.log("sub process type: ", type);
  const handler = taskMap[type];

  if (!handler) {
    throw new Error(`Unknown task type: ${type}`);
  }

  try {
    await handler(payload);
    // console.log(`sub process ${type} done`);
    process.send?.({ type: "done" });
    process.exit(0);
  } catch (err) {
    // console.log(`sub process ${type} error: ${String(err)}`);
    process.send?.({ type: "error", error: String(err) });
    process.exit(1);
  }
});

import { fork, ChildProcess } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import terminate from "terminate/promise";

import { type WorkerTaskType, type WorkerTaskPayload, WorkerTaskEnum } from "./types";

// ESM 下获取 worker.js 路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workerPath = path.resolve(__dirname, "./worker.js");

class TaskManager {
  private taskMap = new Map<string, ChildProcess>();

  async runTask<T extends WorkerTaskType>(options: {
    id: string;
    type: T;
    payload?: WorkerTaskPayload<T>;
  }) {
    const { id, type, payload } = options;

    // 如果已有任务在运行 → kill
    await this.cancelTask(id);

    return new Promise((resolve, reject) => {
      const child = fork(workerPath, [], {
        stdio: ["inherit", "inherit", "inherit", "ipc"],
        detached: true,
      });

      this.taskMap.set(id, child);

      const onChildMessage = (msg: any) => {
        // console.log(msg);
        if (msg.type === "done") {
          resolve(void 0);
          this.taskMap.delete(id);
        } else if (msg.type === "error") {
          reject(msg.error);
          this.taskMap.delete(id);
        } else if (msg.type === "exit") {
          reject("exit");
          this.taskMap.delete(id);
        }
      };

      // 监听 IPC 消息
      child.on("message", onChildMessage);

      const onChildExit = (code, _signal) => {
        // console.log(
        //   `Task ${id} exited with code ${code}, signal ${signal} ${child.pid}`,
        // );
        if (typeof code === "number" && !code) {
          reject(`Task ${id} exited with code ${code}`);
          this.taskMap.delete(id);
        }
      };
      child.on("exit", onChildExit);

      // 发送任务给子进程
      child.send({
        type,
        payload,
      });
    });
  }

  async cancelTask(id: string) {
    const child = this.taskMap.get(id);

    if (child) {
      // console.log(`cancel task ${id} ${prev.pid}`);
      child.send({ type: WorkerTaskEnum.exit });
      try {
        await terminate(child.pid!);
      } catch {}
      this.taskMap.delete(id);
      // console.log(`cancel task ${id} ${prev.pid} done`);
    }
  }
}

export const taskManager = new TaskManager();

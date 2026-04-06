export enum WorkerTaskEnum {
  buildAllWxss = "vite-build-all-wxss",
  buildJs = "vite-build-js",
  exit = "exit",
}

export interface WorkerTaskMap {
  [WorkerTaskEnum.buildAllWxss]: {
    payload: undefined;
  };
  [WorkerTaskEnum.buildJs]: {
    payload: undefined;
  };
  [WorkerTaskEnum.exit]: {
    payload: undefined;
  };
}

export type WorkerTaskType = keyof WorkerTaskMap;

export type WorkerTaskPayload<T extends WorkerTaskType> = WorkerTaskMap[T]["payload"];

export type WorkerTaskMessage<T extends WorkerTaskType = WorkerTaskType> = {
  type: T;
  payload: WorkerTaskPayload<T>;
};

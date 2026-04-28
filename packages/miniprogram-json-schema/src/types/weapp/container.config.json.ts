export interface ContainerConfigJsonForCloudbaseContainerService {
  /**
   * 版本备注
   * version note. e.g. version number, feature description, etc.
   */
  remark?: string;
  /**
   * Dockerfile 相对文件夹的路径
   * Relative path to Dockerfile
   */
  dockerfilePath?: string;
  /**
   * 构建目录
   * Build directory
   */
  buildDir?: string;
  /**
   * 云端运行的最少实例数量
   * Minimum number of running instances in the cloud
   */
  minNum?: number;
  /**
   * 云端运行的最大实例数量
   * Maximum number of running instances in the cloud
   */
  maxNum?: number;
  /**
   * 实例 CPU 规格（单位：核）
   * CPU spec (unit: core)
   */
  cpu?: number;
  /**
   * 实例内存规格（单位：GB）
   * Memory spec (unit: GB)
   */
  mem?: number;
  /**
   * 自动扩缩容依据，默认 cpu
   * Basis for auto-scaling, based on CPU by default
   */
  policyType?: string;
  /**
   * 自动扩缩容临界点
   * Auto-scaling threshold
   */
  policyThreshold?: number;
  /**
   * 环境变量
   * Environment variables
   */
  envParams?: {
    [k: string]: unknown;
  };
  /**
   * 容器内部监听的端口号
   * The port listened inside the container
   */
  containerPort?: number;
  /**
   * 启动检测延迟，如 2s 则会在启动后 2s 检测判断容器实例是否正常启动
   * Delay of launch detection, e.g. if set to 2s, then the system will check whethere the service has started properly after deploying the container instance
   */
  initialDelaySeconds?: number;
  /**
   * 是否将新部署的版本的流量设为 100%，如果填 1 则是，填 0 则设为 0%，仅支持 0 或 1
   * Whether to set the flow percentage of the newly deployed version to 100%, if the value is 1, then yes, if the value is 0, then set to 0%, only 0 and 1 is supported.
   */
  flowRatio?: 0 | 100;
  [k: string]: unknown;
}

// logs.ts
import { formatTime } from "../../utils/util";

Component({
  data: {
    logs: [],
  },
  lifetimes: {
    attached() {
      this.setData({
        logs: (wx.getStorageSync("logs") || []).map((log: string) => {
          return {
            date: formatTime(new Date(log)),
            timeStamp: log,
          };
        }),
      });
    },
  },
});

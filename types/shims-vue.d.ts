import Vue from "vue";
import { EventKeys } from "./event-keys";

declare module "vue/types/vue" {
  interface Vue {
    /**
     * 全局互相调用event的dispatch
     */
    globalDispatch: (eventKey: EventKeys, ...args: any[]) => any;
  }
}

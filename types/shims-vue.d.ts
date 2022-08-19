import Vue from "vue";
import { EventKeys } from "./event-keys";

export type EventParams = { target: EventKeys; eKey: string };

function globalDispatch(eventKey: EventKeys, ...args: any[]): any;
function globalDispatch(eventParams: EventParams, ...args: any[]): any;

declare module "vue/types/vue" {
  interface Vue {
    /**
     * 全局互相调用event的dispatch
     */
    globalDispatch: typeof globalDispatch;
  }
}

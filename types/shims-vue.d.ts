import Vue from "vue";
import type { EventKeys } from "./event-keys";
import { bus } from '../plugins/bus'

export type EventParams = { target: EventKeys; eKey: string };

function globalDispatch(eventKey: EventKeys, ...args: any[]): any;
function globalDispatch(eventParams: EventParams, ...args: any[]): any;

const vm = new Vue();

interface EventBus {
  on: typeof bus.$on;
  emit: typeof bus.$emit;
  off: typeof bus.$off;
}

declare module "vue/types/vue" {
  interface Vue {
    /**
     * 全局互相调用event的dispatch
     */
    globalDispatch: typeof globalDispatch;
    $bus: EventBus;
  }
}

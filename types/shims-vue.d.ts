import Vue from "vue";
import { EventKeys } from "./event-keys";

declare module "vue/types/vue" {
  interface Vue {
    globalDispatch: (eventKey: EventKeys, ...args: any[]) => any;
  }
}

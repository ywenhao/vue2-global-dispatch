import Vue from "vue";

const DEFAULT_E_KEY = "__default";
/**
 * 方法合集
 * @type {Record<string, {eKey: string; handler: function[]}[]>}
 */
const events = {};

/**
 * 全局调用event的mixin
 * @type {Vue & import("vue").ComponentOptions}
 */
const globalDispatch = {
  created() {
    const filePath = this.$options.__file ?? this.$options.__filePath;
    const eKey = this.$attrs.eKey;
    filePath && addEvents(filePath, this, eKey);
  },
  destroyed() {
    const filePath = this.$options.__file ?? this.$options.__filePath;
    const eKey = this.$attrs.eKey;
    filePath && removeEvents(filePath, eKey);
  }
};

/**
 * 监听方法
 * @param {string} filePath 获取到的路径
 * @param {Vue} vm vue组件实例
 * @param {string=} eKey event key
 */
function addEvents(filePath, vm, eKey = DEFAULT_E_KEY) {
  const methods = vm.$options.methods;
  if (methods) {
    Object.entries(methods).forEach(([key, handler]) => {
      handler = handler.bind(vm);
      const eventKey = `${filePath}:${key}`;
      const event = { eKey, handler };

      if (events[eventKey] && events[eventKey].length) {
        events[eventKey].push(event);
      } else {
        events[eventKey] = [event];
      }
    });
  }
}

/**
 * 移除方法
 * @param {string} filePath 获取到的路径
 * @param {string=} eKey event key
 */
function removeEvents(filePath, eKey = DEFAULT_E_KEY) {
  Object.keys(events).forEach(key => {
    if (key.startsWith(filePath)) {
      events[key] = events[key].filter(v => v.eKey !== eKey);
    }
  });
}

/**
 *
 * @param {import("../../types/event-keys").EventKeys | import("../../types/shims-vue").EventParams} params
 * @param  {...any} args
 * @returns
 */
Vue.prototype.globalDispatch = function dispatch(params, ...args) {
  let eventKey,
    eKey = DEFAULT_E_KEY;
  if (typeof params === "string") {
    eventKey = params;
  } else if (typeof params === "object") {
    eventKey = params.target;
    eKey = params.eKey ?? DEFAULT_E_KEY;
  }

  const eKeyMsg = eKey !== DEFAULT_E_KEY ? `eKey:${eKey},` : "";

  if (
    !eventKey ||
    typeof eventKey !== "string" ||
    !/^[^:]*:[^:](.*){1}$/.test(eventKey)
  ) {
    throw new Error(`${eKeyMsg}eventKey:${eventKey}, 参数不正确!`);
  }

  const handlers = events[eventKey]?.filter(v => v.eKey === eKey);
  if (handlers && handlers.length) {
    const results = handlers.map(v => v.handler(...args));
    if (results.length === 1) return results[0];
    return results.map(result => ({ eKey, result }));
  }

  const method = eventKey.split(":")[1];
  throw new Error(`${eKeyMsg}method:${method},该方法未找到!`);
};

export default globalDispatch;

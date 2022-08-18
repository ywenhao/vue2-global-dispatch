import Vue from "vue";

/**
 * 方法合集
 * @type {Record<string, function>}
 */
const events = {};

/**
 * 全局调用event的mixin
 * @type {Vue & import("vue").ComponentOptions}
 */
const globalDispatch = {
  created() {
    const filePath = this.$options.__file;
    filePath && addEvents(filePath, this);
  },
  destroyed() {
    const filePath = this.$options.__file;
    filePath && removeEvents(filePath);
  }
};

/**
 * 监听方法
 * @param {string} filePath 获取到的路径
 * @param {Vue} vue vue组件实例
 */
function addEvents(filePath, vue) {
  const methods = vue.$options.methods;
  if (methods) {
    Object.entries(methods).forEach(([key, handler]) => {
      const eventKey = `${filePath}:${key}`;
      events[eventKey] = handler.bind(vue);
    });
  }
}

/**
 * 移除方法
 * @param {string} filePath 获取到的路径
 */
function removeEvents(filePath) {
  Object.keys(events).forEach(key => {
    if (key.startsWith(filePath)) delete events[key];
  });
}

/**
 *
 * @param {import("../../types/event-keys").EventKeys} eventKey
 * @param  {...any} args
 * @returns
 */
Vue.prototype.globalDispatch = function dispatch(eventKey, ...args) {
  const handler = events[eventKey];
  if (handler) {
    return handler(...args);
  }
  console.error("该方法未找到!");
};

export default globalDispatch;

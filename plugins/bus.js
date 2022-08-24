import Vue from "vue";

export const bus = new Vue();

function on(event, callback) {
  const throwError = e => {
    if (Object.keys(bus._events).includes(e)) {
      throw new Error(`${e}方法已存在`);
    }
  };

  try {
    if (Array.isArray(event)) {
      for (let e of event) {
        throwError(e);
      }
    }

    throwError(event);

    bus.$on(event, callback);
  } catch (e) {
    throw new Error(e);
  }
}

function emit(event, ...args) {
  return bus.$emit(event, ...args);
}

function off(event, callback) {
  return bus.$off(event, callback);
}

Vue.prototype.$bus = { on, emit, off };

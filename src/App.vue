<template>
  <div id="app">
    <router-view />
    <router-view />
    <button @click="onClick">click</button>
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    onClick() {
      const res = this.globalDispatch(
        { target: "src/views/IndexView.vue:test" },
        1,
        2
      );
      console.log(res);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/base.scss";
</style>

<template>
  <div id="app">
    <router-view />
    <button @click="onClick">click</button>
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    onClick() {
      this.globalDispatch("src/views/IndexView.vue:test", "试试", "看看");
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/base.scss";
</style>

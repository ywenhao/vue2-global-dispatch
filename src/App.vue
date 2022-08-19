<template>
  <div id="app">
    <router-view />
    <router-view v-if="visible" />
    <button @click="onClick">click</button>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      visible: true
    };
  },
  methods: {
    onClick() {
      const res = this.globalDispatch(
        { target: "src/views/IndexView.vue:test" },
        1,
        2
      );
      this.visible = !this.visible;
      console.log(res);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/base.scss";
</style>

<template>
  <div id="app">
    <router-view v-if="visible" />
    <router-view />
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
  mounted() {
    this.$bus.on(["test", "aa"], () => {
      console.log({ vm: this });
    });
  },
  methods: {
    onClick() {
      // const res = this.globalDispatch(
      //   { target: "src/views/IndexView.vue:test" },
      //   1,
      //   2
      // );
      // this.visible = !this.visible;
      // console.log(res);
      this.$bus.emit("aa");
      this.$bus.off("aa");
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/base.scss";
</style>

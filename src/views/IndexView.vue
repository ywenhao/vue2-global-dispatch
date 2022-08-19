<template>
  <div class="">
    <div>v1:{{ v1 }}</div>
    <div>v2:{{ v2 }}</div>
  </div>
</template>

<script>
export default {
  name: "index-view",
  data() {
    return {
      v1: 1,
      v2: 2
    };
  },
  mounted() {
    console.log(this);
  },
  methods: {
    test(v1, v2) {
      this.v1 += v1;
      this.v2 += v2;
      return [this.v1, this.v2];
    }
  }
};
</script>

<style lang="scss" scoped></style>

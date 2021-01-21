<template>
  <div class="">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        name: '',
        query: {}
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.name = from.name;
        vm.query = to.query;
      });
    },
    mounted() {
      this.$nextTick(() => {
        this.$router.replace({ name: this.name, query: this.query });
      });
    }
  };
</script>

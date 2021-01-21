<template>
  <div class="statement page">
    <div class="title"><h1>{{type===1?'隐私声明':'版权声明'}}</h1></div>
    <div class="rich-text" v-html="type===1?statement.privacy:statement.copyright"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        type: 1,
        statement: {}
      };
    },
    beforeRouteUpdate(to, from, next) {
      this.type = parseInt(to.query.id);
      next();
    },
    mounted() {
      this.type = parseInt(this.$route.query.id);
      this.utils.ajax(this, 'api/statement').then(res => {
        this.statement = res;
      })
    }
  };
</script>

<style lang="scss" scoped>
  .statement {
    padding-top: 5px;
    padding-bottom: 14px;

    .rich-text {
      padding: 24px;
      overflow: hidden;
      font-size: 26px;
      color: #666666;
      background-color: #ffffff;
    }
  }
</style>

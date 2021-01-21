<template>
  <div class="explain page">
    <div class="cont white">
      <h3>讲解参观流程</h3>
      <div class="rich-text" v-html="explain"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return { explain: '' };
    },
    mounted() {
      this.utils.ajax(this, 'api/aboutUs').then(res => {
        this.explain = res.explain;
      });
    }
  };
</script>

<style lang="scss" scoped>
  .explain {
    .cont {
      margin-top: 7px;
      margin-bottom: 14px;
      padding: 30px 24px 0;

      h3 {
        font-size: 34px;
        color: #333333;
        text-align: center;
        font-weight: 400;
      }

      .rich-text {
        margin-top: 57px;
        font-size: 28px;
        color: #666666;
        line-height: 42px;

        /deep/ img {
          display: block;
          max-width: calc(100% - 66px);
          margin: 0 auto;
        }
      }
    }
  }
</style>

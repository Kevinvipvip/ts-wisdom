<template>
  <div class="new-detail page">
    <h3>{{detail.title}}</h3>
    <p><span>[{{detail.author}}]</span><span>{{detail.create_time}}</span></p>
    <div class="rich-box" v-html="detail.content"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: 0,

        detail: {}
      };
    },
    mounted() {
      this.id = parseInt(this.$route.query.id);
      this.getNewDetail();
    },
    methods: {
      getNewDetail() {
        this.utils.ajax(this, 'api/articleDetail', { article_id: this.id }).then(obj => {
          // console.log(obj);
          this.detail = obj;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .new-detail {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0 24px;
    box-sizing: border-box;

    h3 {
      font-weight: normal;
      font-size: 36px;
      margin: 35px 0 24px;
      line-height: 50px;
    }

    p {
      font-size: 28px;
      color: #999999;

      span {
        margin-right: 25px;
      }
    }

    .rich-box {
      margin-top: 30px;
      font-size: 28px;
      text-align: justify;
      line-height: 60px;

      /deep/ img {
        max-width: 100%;
      }
    }
  }
</style>

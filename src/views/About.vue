<template>
  <div class="about page">
    <div class="contain white">
      <div class="title"><h1>唐博概况</h1></div>

      <div class="img" :style="'background-image: url('+about.brief_img+')'"></div>
      <div class="rich-text" v-html="about.intro"></div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        about: {}
      }
    },
    mounted() {
      this.utils.ajax(this, 'api/aboutUs').then(obj => {
        obj.brief_img = this.config.aliyun + 'ts-static/wap/img-brief-home.jpg';
        this.about = obj;
      })
    }
  }
</script>
<style scoped lang="scss">
  .about {
    overflow: hidden;

    .contain {
      margin-top: 2px;
      padding: 6px 24px 100px;

      .img {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 339px;
      }

      .rich-text {
        font-size: 28px;
        margin-top: 27px;
        color: #666666;
        text-align: justify;

        /deep/ img {
          max-width: 100%;
          display: block;
        }
      }
    }
  }
</style>

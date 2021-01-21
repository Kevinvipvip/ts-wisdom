<template>
  <!--典藏文物-->
  <div class="collection page">
    <div class="banner"><img :src="imgs.banner"/></div>
    <ul>
      <li v-for="(item,index) in cate" :key="'cate'+index" :style="'background-image: url('+imgs.cate_bg+')'"
          @click="to_collection_list(item.id)">
        <p>{{item.cate_name}}</p>
        <div class="img" :style="'background-image: url('+item.pic2+')'"></div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imgs: {
          banner: this.config.aliyun + 'ts-static/wap/img-collection.png',
          cate_bg: this.config.aliyun + 'ts-static/wap/bg-cate.png'
        },//图片在阿里云上的保存路径
        cate: [],//分类
      };
    },
    mounted() {
      this.getCollectCateList();
    },
    methods: {
      // 点击前往相应分类的藏品列表
      to_collection_list(id) {
        this.$router.push({ name: 'collect_list', query: { cate_id: id } })
      },

      // 获取分类数据
      getCollectCateList() {
        this.utils.ajax(this, 'api/collectCateList').then((arr) => {
          this.utils.aliyun_format(arr, 'pic2');
          this.cate = arr;
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  .collection {
    overflow: hidden;

    .banner {
      margin: 24px;
    }

    ul {
      margin: 40px 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      li {
        width: 344px;
        height: 459px;
        border-radius: 18px;
        overflow: hidden;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
        margin-bottom: 24px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        .img {
          width: 254px;
          height: 288px;
          margin-top: 34px;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
        }

        p {
          width: 194px;
          height: 50px;
          background-image: url("../assets/border/border-cate.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
          font-size: 36px;
          text-align: center;
          line-height: 50px;
          color: #ffffff;
        }
      }
    }
  }
</style>

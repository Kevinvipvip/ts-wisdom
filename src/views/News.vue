<template>
  <div class="news page">

    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul>
        <li v-for="(item,index) in news" :key="index" @click="to_new_detail(item.id)">
          <div class="cont">
            <h3 :class="index===0?'one-line-ellipsis':'two-line-ellipsis'">
              {{item.title}}</h3>
            <p><span>{{item.author}}</span><span>{{item.create_time}}</span></p>
          </div>
          <div class="img" :style="'background-image: url('+item.pic+')'"></div>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        news: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    methods: {
      onLoad() {
        this.page++;
        this.getArticleList(this.page, () => {
          this.loading = false;
          if (this.news.length >= this.count) {
            this.finished = true
          }
        })
      },

      to_new_detail(id) {
        this.$router.push({ name: 'new-detail', query: { id: id } });
      },

      //获取新闻资讯列表
      getArticleList(page, callback) {
        let post = {
          page: page,
          perpage: 10
        };
        this.utils.ajax(this, 'api/articleList', post).then(obj => {
          this.count = obj.count;
          this.utils.aliyun_format(obj.list, 'pic');
          for (let i = 0; i < obj.list.length; i++) {
            obj.list[i].create_time = this.utils.date_format(new Date(obj.list[i].create_time).getTime(), 'yyyy-MM-dd');
            this.news.push(obj.list[i]);
          }
        }).then(() => {
          callback();
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .news {
    overflow: hidden;
    background-color: #ffffff;

    ul {
      li {
        display: flex;
        justify-content: space-between;
        height: 120px;
        margin: 24px;
        border-bottom: 1px solid #f0f0f0;
        padding: 24px 0;
        /*box-sizing: border-box;*/

        .cont {
          flex-grow: 1;
          height: 100%;
          display: flex;
          flex-flow: column;
          justify-content: space-between;

          h3 {
            font-size: 28px;
            color: #333333;
            line-height: 34px;
            font-weight: normal;
          }

          p {
            font-size: 24px;
            color: #999999;

            span {
              margin-right: 20px;
            }
          }
        }

        .img {
          margin-left: 28px;
          flex-shrink: 0;
          width: 240px;
          height: 100%;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 10px;
          background-size: cover;
        }

        &:first-child {
          position: relative;
          height: 350px;
          z-index: 1;
          margin: 0;
          padding: 0;

          .cont {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            z-index: 3;

            h3 {
              background-color: rgba(0, 0, 0, 0.6);
              height: 100%;
              width: 100%;
              line-height: 60px;
              padding: 0 25px;
              box-sizing: border-box;
              color: #ffffff;
            }

            p {
              display: none;
            }
          }

          .img {
            z-index: 2;
            position: absolute;
            margin: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: unset;
          }
        }
      }
    }
  }
</style>

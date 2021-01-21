<template>
  <div class="books no-footer-page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul class="white">
        <li v-for="(item,index) in books" :key="index">
          <div class="img" :style="'background-image: url('+item.pic+')'">
            <p>作者：{{item.author}}</p>
          </div>
          <h3 class="two-line-ellipsis">{{item.title}}</h3>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        books: [],//出版书籍列表

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    methods: {
      onLoad() {
        this.page++;
        this.getStudyBookList(this.page, () => {
          this.loading = false;
          if (this.books.length >= this.count) {
            this.finished = true
          }
        })
      },
      //获取新闻资讯列表
      getStudyBookList(page, callback) {
        let post = {
          page: page,
        };
        this.utils.ajax(this, 'study/studyBookList', post).then(obj => {
          this.count = obj.count;
          this.utils.aliyun_format(obj.list);
          for (let i = 0; i < obj.list.length; i++) {
            this.books.push(obj.list[i]);
          }
        }).then(() => {
          callback();
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .books {
    overflow: hidden;

    ul {
      margin-top: 5px;
      padding: 0 24px 40px;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      li {
        margin-top: 40px;
        width: calc(50% - 12px);

        .img {
          height: 480px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: flex-end;

          p {
            background-color: rgba(207, 144, 58, 0.8);
            font-size: 24px;
            color: #ffffff;
            width: 100%;
            height: 60px;
            text-align: center;
            line-height: 60px;
          }
        }

        h3 {
          font-size: 26px;
          color: #333333;
          font-weight: normal;
          text-align: center;
          margin-top: 21px;
        }
      }
    }
  }
</style>

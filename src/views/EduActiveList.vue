<template>
  <div class="edu-active-list no-footer-page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul>
        <li v-for="(item,index) in edu_list" :key="index">
          <p>{{item.start_time}}</p>
          <h3>{{item.title}}</h3>
          <div class="img-list">
            <div class="img" v-for="(v,i) in item.pics" :key="'edu-item'+i"
                 :style="'background-image:url('+v+')'" @click="look_big_pic(item.pics,index)">
              <!--<i :style="'background-image:url('+v+')'"></i>-->
            </div>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
  import { ImagePreview } from 'vant'

  export default {
    data() {
      return {
        id: 0,
        edu_list: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    beforeRouteUpdate(to, from, next) {
      // this.id = parseInt(to.query.id);
      this.$router.push({ name: 'center', query: { id: to.query.id } });
      next();
    },
    mounted() {
      this.id = parseInt(this.$route.query.id);
    },
    methods: {
      // 点击查看大图
      look_big_pic(arr,index) {
        ImagePreview({
          images: arr,
          startPosition: index,
          onClose() {
            // do something
          }
        })
      },

      onLoad() {
        this.page++;
        this.getEduList(this.page, () => {
          this.loading = false;
          if (this.edu_list.length >= this.count) {
            this.finished = true
          }
        })
      },
      // 获取教育活动列表
      getEduList(page, complete) {
        let post = { tid: this.id, page: page, perpage: 10 };
        this.utils.ajax(this, 'edu/eduList', post).then(res => {
          this.count = res.count;
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].start_time = this.utils.date_format(new Date(res.list[i].start_time), 'yyyy.MM.dd');
            this.utils.aliyun_format(res.list[i].pics);
            this.edu_list.push(res.list[i]);
          }
        }).then(() => {
          complete()
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .edu-active-list {
    ul {
      li {
        background-color: #ffffff;
        margin-top: 14px;
        padding: 40px 24px;

        p {
          font-size: 24px;
          color: #333333;
          font-weight: 400;
        }

        h3 {
          font-size: 28px;
          color: #666666;
          font-weight: normal;
          margin: 29px 0 40px;
        }

        .img-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          .img {
            width: calc(50% - 6px);
            height: 230px;
            background-size: cover;
            border-radius: 10px;
            background-position: center;
            background-repeat: no-repeat;
            margin-top: 12px;

            &:nth-child(-n+2) {
              margin-top: 0
            }
          }
        }
      }
    }
  }
</style>

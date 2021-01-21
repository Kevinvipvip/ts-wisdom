<template>
  <div class="exhibition page">
    <!--常设展览-->
    <div class="standing white">
      <div class="title"><h1>常设展览</h1></div>
      <div class="img" :style="'background-image: url('+standing[standing_index].cover+')'"></div>
      <div class="cont">
        <div class="item" v-for="(item,index) in standing" :key="'standing'+index"
             @click="choise_standing(item.id,index)">
          <h3 :class="standing_index===index?'choice':''" class="one-line-ellipsis">{{item.title}}</h3>
          <p class="one-line-ellipsis">{{item.desc}}</p>
        </div>
      </div>
      <div class="more exhibit-more">
        <router-link to="/exhibit_standing">查看更多</router-link>
      </div>
    </div>

    <!--临时展览-->
    <div class="temp white" v-if="temp.length>0">
      <div class="title"><h1>临时展览</h1></div>
      <div class="cont">
        <div class="item" v-for="(item,index) in temp" :key="'temp'+index" @click="choise_standing(item.id)">
          <div class="img" :style="'background-image: url('+item.cover+')'">
            <div class="tip" :class="'bg'+item.cate_id">{{item.tag}}</div>
          </div>
          <h3 class="two-line-ellipsis">{{item.title}}</h3>
        </div>
      </div>
      <div class="more exhibit-more">
        <router-link to="/exhibit_temp">查看更多</router-link>
      </div>
    </div>

    <!--展览计划-->
    <div class="plan white" v-if="plan.length>0">
      <div class="title"><h1>展览计划</h1></div>
      <ul>
        <li v-for="(item,index) in plan" :key="'plan'+index" @click="to_plan_detail(item.id)">
          <div class="date">
            <span class="day">{{item.day}}</span>
            <span>{{item.date}}</span>
          </div>
          <div class="item-cont">
            <h3 class="one-line-ellipsis">{{item.title}}</h3>
            <p class="two-line-ellipsis">{{item.desc}}</p>
          </div>
        </li>
      </ul>
      <div class="more exhibit-more">
        <router-link to="/exhibit_plan">查看更多</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        standing_index: 0,//当前显示的常设展览图片索引值
        standing: [{ cover: '' }],//常设展览数据
        temp: [],//临时展览数据
        plan: [],//展览计划数据
      };
    },
    mounted() {
      this.getDisplayList(2, 3, arr => {
        console.log(arr,'常设展览数据');
        this.standing = arr;
      });
      this.getDisplayList(1, 4, arr => {
        console.log(arr,'临时展览数据');
        this.temp = arr;
      });
      this.getDisplayArticleList();
    },
    methods: {
      // 点击常设展览列表
      choise_standing(id, index) {
        this.standing_index = index;
        this.$router.push({ path: '/detail_exhibit', query: { id: id } });
      },

      // 点击跳转展览计划详情页
      to_plan_detail(id) {
        this.$router.push({ path: '/detail_plan', query: { id: id } });
      },

      // 获取展览列表
      getDisplayList(type, perpage, succ) {
        let post = {
          type: type,//1为临时展览；2为常设展览；0为全部
          cate_id: this.tab,//type为1时有效；1为馆际交流，2为原创展览；0为全部
          page: 1,
          perpage: perpage
        };
        this.utils.ajax(this, 'api/displayList', post).then(res => {
          this.utils.aliyun_format(res.list, 'cover');
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].start_time = this.utils.date_format(res.list[i].start_time, 'yyyy/MM/dd');
            res.list[i].end_time = this.utils.date_format(res.list[i].end_time, 'yyyy/MM/dd');
          }
          if (succ) {
            succ(res.list);
          }
        });
      },

      // 获取展览计划
      getDisplayArticleList() {
        this.utils.ajax(this, 'api/displayArticleList', { page: 1, perpage: 4 }).then(res => {
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].day = this.utils.date_format(new Date(res.list[i].create_time), 'dd');
            res.list[i].date = this.utils.date_format(new Date(res.list[i].create_time), 'yyyy.MM');
          }
          this.plan = res.list;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .exhibition {
    overflow: hidden;
    padding-bottom: 24px;

    .exhibit-more {
      margin: 60px auto 40px;
    }

    /*常设展览*/
    .standing {
      margin-top: 14px;
      padding: 0 24px;
      overflow: hidden;

      .img {
        margin-top: 49px;
        height: 468px;
        border-radius: 10px;
        background-size: cover;
        border: 2px solid #eeeeee;
        background-repeat: no-repeat;
        background-position: center;
      }

      .cont {
        .item {
          margin-top: 40px;
          border-bottom: 2px solid #cf903a;
          padding-bottom: 24px;

          h3 {
            font-size: 28px;
            color: #333333;
            font-weight: normal;
            padding-left: 41px;
            margin-bottom: 30px;
            background-image: url("../assets/icons/arrow-right.png");
            background-position: left;
            background-repeat: no-repeat;
            background-size: 17px 28px;

            &.choice {
              color: #cf903a;
            }
          }

          p {
            padding-left: 41px;
            font-size: 26px;
            color: #666666;
          }
        }
      }
    }

    /*临时展览*/
    .temp {
      margin-top: 14px;
      padding: 0 24px;
      overflow: hidden;

      .cont {
        margin-top: 26px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .item {
          width: 344px;
          margin-top: 30px;

          &:nth-child(-n+2) {
            margin-top: 0;
          }

          .img {
            width: 100%;
            height: 230px;
            border: 2px solid #e5e5e5;
            box-sizing: border-box;
            border-radius: 10px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;

            .tip {
              width: 110px;
              height: 38px;
              margin: 10px;
              background-color: #cf903a;
              border-radius: 5px;
              font-size: 20px;
              color: #ffffff;
              text-align: center;
              line-height: 38px;

              &.bg1 {
                background-color: #29ac83;
              }
            }
          }

          h3 {
            font-weight: normal;
            line-height: 42px;
            margin-top: 18px;
            font-size: 28px;
            color: #333333;
          }
        }
      }
    }

    /*展览计划*/
    .plan {
      overflow: hidden;
      margin-top: 14px;
      padding: 0 24px;

      ul {
        margin-top: 26px;

        li {
          border: solid 1px #d0a34d;
          height: 160px;
          margin-left: 36px;
          margin-bottom: 24px;
          display: flex;

          .date {
            position: relative;
            left: -36px;
            margin-top: 20px;
            height: 111px;
            min-width: 100px;
            background-color: #d0a34d;
            display: flex;
            flex-flow: column;
            justify-content: center;
            flex-shrink: 0;
            margin-right: 21px;

            span {
              display: block;
              font-size: 20px;
              color: #ffffff;
              margin: 0 20px;

              &.day {
                font-size: 46px;
              }
            }
          }

          .item-cont {
            margin-left: -36px;
            height: 100%;
            overflow: hidden;
            text-align: justify;
            margin-right: 15px;

            h3 {
              font-size: 30px;
              font-weight: normal;
              margin-top: 15px;
              color: #333333;
            }

            p {
              margin-top: 10px;
              font-size: 26px;
              color: #666666;
            }
          }
        }
      }
    }

  }
</style>

<template>
  <div class="edu-active page">
    <ul>
      <li v-for="item in theme_list" :key="item.id">
        <h2 :class="show_on===item.id?'show':''" @click="show_on=item.id">{{item.title}}</h2>
        <div class="theme-cont" :class="show_on===item.id?'show':''"
             :style="'background-image: url('+theme_bg+')'">
          <div class="theme-cont-border">
            <div class="cont">
              <span>{{item.desc}}</span>
              <p>{{item.content}}</p>
            </div>
            <div class="more btn-theme">
              <router-link :to="{path:'/edu_active_list',query:{id:item.id}}">进入内容</router-link>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        theme_bg: this.config.aliyun + 'ts-static/wap/bg-nav.jpg',//主题内容背景图
        show_on: 1,
        theme_list: [],//主题列表
      };
    },
    mounted() {
      this.utils.ajax(this, 'edu/themeList').then(res => {
        this.theme_list = res;
      });
    }
  };
</script>

<style lang="scss" scoped>
  .edu-active {
    overflow: hidden;

    ul {
      margin: 24px 24px 80px;

      li {
        overflow: hidden;

        h2 {
          height: 110px;
          background-image: url("../assets/bgs/title-yellow.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          font-size: 40px;
          color: #333333;
          text-align: center;
          line-height: 110px;

          &.show {
            background-image: url("../assets/bgs/title-red.png");
            color: #ffffff;
          }
        }

        .theme-cont {
          transition: 0.5s;
          height: 0;
          background-repeat: repeat-y;
          background-size: 100%;
          background-position: top;
          overflow: hidden;

          .theme-cont-border {
            height: 100%;
            background-repeat: no-repeat;
            background-position: top, bottom;
            background-image: url("../assets/border/border-red-top.png"), url("../assets/border/border-red-bottom.png");
            background-size: 100%, 100%;
            overflow: hidden;

            .cont {
              display: flex;
              flex-flow: column;
              align-items: center;
              color: #666666;

              span {
                font-size: 26px;
                display: block;
                margin: 40px 0;
              }

              p {
                margin: 0 24px;
                text-align: justify;
                line-height: 39px;
                font-size: 24px;
              }
            }

            .btn-theme {
              background-image: url("../assets/bgs/btn-red-240.png");
              margin: 65px auto;

              a {
                color: #ffffff;
              }
            }
          }

          &.show {
            margin: 14px 0;
            height: unset;
          }
        }
      }
    }

  }
</style>

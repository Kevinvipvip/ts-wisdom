<template>
  <div class="header" :style="show_nav?'height: 100vh':'height: 44px'">
    <div class="fixed-header">
      <router-link tag="div" to="/" class="logo"><img  @click="show_nav=false" src="../assets/logo.png"/></router-link>
      <div class="icon-box">
        <div class="header-icon mine" @click="to_jump('mine')"></div>
        <div class="header-icon search" @click="to_jump('search')"></div>
        <div class="header-icon" :class="show_nav?'close':''" @click="show_nav=!show_nav"></div>
      </div>
    </div>
    <ul :style="'background-image: url('+imgs[0]+')'">

      <li v-for="(item,index) in nav" :key="item.id" @click="show_nav=false" :class="nav_id===item.id?'has-s-nav':''">
        <p v-if="item.s_nav.length" @click.stop="click_s_nav(index)">{{item.name}}</p>
        <router-link v-else :to="item.url">{{item.name}}</router-link>
        <i :class="nav_id===item.id?'change':''" @click.stop="click_s_nav(index)" v-if="item.s_nav.length"></i>
        <div class="s-nav" v-if="nav_id===item.id" @click.stop>
          <h2 @click.stop="show_nav=false">
            <router-link :to="item.url">{{item.name}}<span></span></router-link>
          </h2>
          <div class="s-nav-item-box">
            <div class="s-nav-item" v-for="(v,i) in item.s_nav" :key="'s-nav'+i" @click.stop="show_nav=false">
              <router-link v-if="v.id" :to="{path:v.s_url,query:{id:v.id}}">{{v.title}}</router-link>
              <router-link v-else :to="v.s_url">{{v.title}}</router-link>
            </div>
          </div>
        </div>
      </li>

    </ul>
  </div>
</template>
<script>
  export default {
    name: 'Header',
    data() {
      return {
        imgs: [this.config.aliyun + 'ts-static/wap/bg-nav.jpg'],
        show_nav: false,
        show_s_nav: false,
        nav_id: 0,

        nav: [
          {
            id: 1, name: '首页', url: '/', s_nav: []
          }, {
            id: 2, name: '唐博概况', url: '/about', s_nav: []
          }, {
            id: 3, name: '最新动态', url: '/news', s_nav: []
          }, {
            id: 4,
            name: '陈列展览',
            url: '/exhibition',
            s_nav: [{
              title: '常设展览', s_url: '/exhibit_standing'
            }, {
              title: '临时展览', s_url: '/exhibit_temp'
            }, {
              title: '展览计划', s_url: '/exhibit_plan'
            },]
          }, {
            id: 5, name: '典藏文物', url: '/collection', s_nav: []
          }, {
            id: 6, name: '学术研究', url: '/academic',
            s_nav: [{
              title: '学术资讯', s_url: '/study_article'
            }, {
              title: '出版书籍', s_url: '/books'
            }, {
              title: '学术委员会', s_url: '/committee'
            },]
          }, {
            id: 7, name: '教育活动', url: '/edu_active', s_nav: []
          }, {
            id: 8, name: '观众服务', url: '/service',
            s_nav: [{
              title: '参观预约', s_url: '/service', id: 1
            }, {
              title: '活动预约', s_url: '/activity'
            }, {
              title: '讲解预约', s_url: '/explain'
            }, {
              title: '交通指南', s_url: '/service', id: 2
            }, {
              title: '参观须知', s_url: '/service', id: 1
            }]
          }, {
            id: 9, name: '文创产品', url: '/products', s_nav: []
          }],
      }
    },
    mounted() {
      this.utils.ajax(this, 'edu/themeList').then(res => {
        for (let i = 0; i < res.length; i++) {
          res[i].s_url = '/edu_active_list';
        }
        this.nav[6].s_nav = res;
      }).then(() => {
        this.config.nav = this.nav;
      });
    },
    methods: {
      click_s_nav(index) {
        this.show_s_nav = !this.show_s_nav;
        if (this.nav_id === this.nav[index].id) {
          this.nav_id = 0;
        } else {
          this.nav_id = this.nav[index].id;
        }
      },
      to_jump(name) {
        this.show_nav = false;
        this.$router.push({ name: name });
      }
    }
  }
</script>
<style scoped lang="scss">
  .header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: #ffffff;
    overflow: hidden;
    transition: 0.5s;

    .fixed-header {
      height: 88px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 24px;

      .logo {
        width: 247px;
        height: 40px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .icon-box {
        display: flex;
        align-items: center;

        .header-icon {
          width: 40px;
          height: 32px;
          background-image: url("../assets/icons/nav.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 40px 32px;
          margin-left: 40px;

          &.close {
            background-image: url("../assets/icons/nav-close.png");
            background-size: 30px 30px;
          }

          &.mine {
            background-image: url("../assets/icons/mine.png");
            background-size: auto 32px;
          }

          &.search {
            background-image: url("../assets/icons/search.png");
            background-size: auto 32px;
          }
        }
      }
    }


    ul {
      height: calc(100vh - 88px);
      padding: 59px 40px;
      box-sizing: border-box;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 59px;
        background-image: url("../assets/border/border-top.png");
        background-repeat: no-repeat;
        background-position: top;
        background-size: 100%;
      }

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 59px;
        background-image: url("../assets/border/border-bottom.png");
        background-repeat: no-repeat;
        background-position: bottom;
        background-size: 100%;
      }

      li {
        height: 75px;
        margin-top: 10px;
        position: relative;
        transition: 0.5s;
        overflow: hidden;

        &:first-child {
          margin-top: 0;
        }

        a, p {
          box-sizing: border-box;
          border-bottom: 2px solid rgba(206, 161, 90, 0.6);
          display: block;
          height: 75px;
          width: 100%;
          line-height: 75px;
          color: #333333;
          font-size: 28px;
        }

        i {
          display: block;
          width: 41px;
          height: 26px;
          position: absolute;
          right: 0;
          top: 28px;
          background-image: url("../assets/icons/s-nav-open.png");
          background-size: 41px 26px;
          background-position: center;
          background-repeat: no-repeat;
          transition: 0.5s;

          &.change {
            /*background-image: url("../assets/icons/s-nav-close.png");*/
            transform: rotate(180deg);
            transform-origin: center 40%;
          }
        }

        .s-nav {
          height: calc(100% - 75px);

          h2 {
            font-weight: normal;
            margin-top: 10px;
            margin-left: 28px;
            font-size: 26px;

            a {
              font-size: 26px;

              span {
                display: inline-block;
                margin-left: 17px;
                width: 12px;
                height: 20px;
                background-image: url("../assets/icons/icon-right.png");
                background-position: center;
                background-repeat: no-repeat;
                background-size: 12px 20px;
              }
            }
          }

          .s-nav-item-box {
            display: flex;
            margin-left: 28px;
            flex-wrap: wrap;
            /*justify-content: space-around;*/

            .s-nav-item {
              margin-right: 80px;
              margin-top: 30px;

              a {
                height: auto;
                line-height: normal;
                border: none;
                font-size: 24px;
                color: #666666;
              }
            }
          }
        }

        &.has-s-nav {
          height: 350px;
        }
      }
    }
  }
</style>

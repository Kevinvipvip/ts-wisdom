<template>
  <div class="web-map page">
    <div class="title"><h1>网站地图</h1></div>
    <div class="url-box white">
      <ul>
        <li v-for="(item,index) in nav" :key="'map'+index">
          <router-link :to="item.url">{{item.name}}<i v-if="item.s_nav.length"></i></router-link>
          <div class="s-nav" v-if="item.s_nav.length">
            <div class="s-nav-item" v-for="(v,i) in item.s_nav" :key="'s-nav'+i">
              <router-link v-if="v.id" :to="{path:v.s_url,query:{id:v.id}}" tag="p" class="s-nav-url">{{v.title}}
              </router-link>
              <router-link v-else :to="v.s_url" tag="p" class="s-nav-url">{{v.title}}</router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        nav: []
      };
    },
    mounted() {
      this.nav = this.config.nav;
    }
  };
</script>

<style lang="scss" scoped>
  .web-map {
    padding-top: 5px;

    .url-box {
      padding-bottom: 60px;
      overflow: hidden;

      ul {
        margin: 79px 40px;

        li {
          margin-bottom: 12px;

          a {
            padding: 24px 0;
            border-bottom: 2px solid rgb(226, 199, 156);
            font-size: 28px;
            color: #333333;
            display: flex;
            align-items: center;

            i {
              display: block;
              width: 12px;
              height: 20px;
              margin-left: 38px;
              background-image: url("../assets/icons/icon-right.png");
              background-repeat: no-repeat;
              background-size: 12px 20px;
              background-position: right;
            }
          }

          .s-nav {
            margin-left: 27px;
            margin-bottom: 71px;
            padding: 24px 0;
            border-bottom: 2px solid rgb(226, 199, 156);
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .s-nav-item {
              margin-right: 60px;

              .s-nav-url {
                border: none;
                font-size: 26px;
                color: #666666;
                line-height: 60px;
              }
            }
          }
        }
      }
    }
  }
</style>

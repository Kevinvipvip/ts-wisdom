<template>
  <div class="friend-link page">

    <div class="cont white">
      <div class="title"><h1>友情链接</h1></div>
      <ul>
        <li v-for="(item,index) in friend" :key="'friend'+index">
          <a :href="item.url" target="_blank">
            <div class="img"><img :src="item.pic"/></div>
            <p>{{item.title}}</p>
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        friend: [
          { title: '河北文明网', pic: this.config.aliyun + 'ts-static/wap/friend/img1.png', url: 'http://hb.wenming.cn' },
          { title: '河北志愿服务网', pic: this.config.aliyun + 'ts-static/wap/friend/img2.png', url: 'http://www.hbzyfw.cn' },
          {
            title: '河北博物院',
            pic: this.config.aliyun + 'ts-static/wap/friend/img3.png',
            url: 'http://www.hebeimuseum.org.cn'
          }, {
            title: '首都博物馆',
            pic: this.config.aliyun + 'ts-static/wap/friend/img4.png',
            url: 'http://www.capitalmuseum.org.cn'
          }, {
            title: '上海博物馆',
            pic: this.config.aliyun + 'ts-static/wap/friend/img5.png',
            url: 'https://www.shanghaimuseum.net'
          }, {
            title: '南京博物院',
            pic: this.config.aliyun + 'ts-static/wap/friend/img6.png',
            url: 'http://www.njmuseum.com'
          },
          { title: '故宫博物院', pic: this.config.aliyun + 'ts-static/wap/friend/img7.png', url: 'https://www.dpm.org.cn' },
          { title: '安徽博物院', pic: this.config.aliyun + 'ts-static/wap/friend/img8.png', url: 'https://www.ahm.cn' },
          {
            title: '广东省博物馆',
            pic: this.config.aliyun + 'ts-static/wap/friend/img9.png',
            url: 'http://www.gdmuseum.com'
          },
          {
            title: '湖南省博物馆',
            pic: this.config.aliyun + 'ts-static/wap/friend/img10.png',
            url: 'http://www.hnmuseum.com'
          },
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .friend-link {
    .cont {
      margin-top: 5px;
      margin-bottom: 14px;
      overflow: hidden;

      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 59px 24px;

        li {
          margin-bottom: 40px;

          a {
            display: block;
            width: 100%;
            height: 100%;

            .img {
              width: 339px;
              height: 176px;
              background-color: #ffffff;
              border: solid 1px #d6d6d6;
              overflow: hidden;
            }

            p {
              font-size: 28px;
              color: #666666;
              text-align: center;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="footer">
    <h3>网站访问量</h3>
    <p>{{footer.visits}}</p>
    <ul>
      <li>
        <router-link to="/web_map">网站地图</router-link>
      </li>
      <li>
        <router-link to="/friend_link">友情链接</router-link>
      </li>
      <li>
        <router-link :to="{path:'/statement',query:{id:1}}">隐私声明</router-link>
      </li>
      <li>
        <router-link :to="{path:'/statement',query:{id:2}}">版权声明</router-link>
      </li>
      <li>
        <router-link to="/about">关于我们</router-link>
      </li>
    </ul>
    <div class="copyright">
      <div class="item-box">
        <div class="item"><span>技术支持：</span><a href="https://www.wcip.net">山海文化</a></div>
        <div class="item">版权所有：唐山博物馆</div>
      </div>
      <div class="item"><span>ICP备案：</span><a href="https://beian.miit.gov.cn">冀ICP备20003697号-1</a>
      </div>
    </div>
    <div class="img"><img src="../assets/img-footer.png"/></div>
  </div>
</template>

<script>
  export default {
    name: "Footer",
    data() {
      return {
        footer: { visits: 15 }
      }
    },
    mounted() {
      this.utils.ajax(this, 'api/aboutUs').then(res => {
        let str = res.visit;
        str = str.toString();
        if (str.length < 8)
          str = (Array(8).join("0") + str).slice(-8);
        this.footer.visits = str;
      });
    }
  }
</script>

<style scoped lang="scss">
  .footer {
    height: 390px;
    background-color: #333333;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    a {
      color: #cccccc;
    }

    h3 {
      font-weight: normal;
      color: #f5f5f5;
      font-size: 24px;
    }

    p {
      margin-top: 23px;
      min-width: 272px;
      height: 44px;
      background-color: #4d4d4d;
      font-size: 24px;
      letter-spacing: 16px;
      text-indent: 16px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ul {
      display: flex;
      align-items: center;
      margin-top: 40px;

      li {
        color: #cccccc;
        font-size: 26px;
        margin: 0 10px;
      }
    }

    .copyright {
      display: flex;
      flex-flow: column;
      align-items: center;
      margin-top: 30px;

      .item-box {
        display: flex;

        .item {
          margin: 0 6px;
        }
      }

      .item {
        color: #cccccc;
        font-size: 24px;
        line-height: 40px;
      }
    }

    .img {
      width: 26px;
      height: 32px;
      margin-top: 31px;
    }
  }
</style>

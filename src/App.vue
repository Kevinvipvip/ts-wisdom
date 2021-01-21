<template>
  <div id="app">
    <Header/>
    <router-view/>
    <Footer v-if="show_footer"/>
  </div>
</template>
<script>
  import Header from './components/Header'
  import Footer from './components/Footer'

  export default {
    components: { Footer, Header },
    data() {
      return {
        show_footer: true
      }
    },
    // 监视路由，设置某些页面没有底部信息
    watch: {
      $route(to) {
        switch (to.name) {
          case 'login'://登录
          case 'collect_list'://文物列表
          case 'news'://新闻资讯
          case 'pay'://支付页
          case 'mine'://个人中心
          case 'search'://搜索页
          case 'books'://出版书籍列表页
          case 'activity'://活动预约
          case 'detail_activity'://活动预约详情
          case 'activity_input'://活动预约填写信息
          case 'detail_ticket'://门票订单详情
          case 'mine_activity'://活动订单详情
          case 'activity_check'://活动预约订单核销页面
          case 'activity_check_history'://活动预约订单核销历史
          case 'edu_active_list'://教育活动列表
          case 'exhibit_temp'://临时展览
          case 'study_article'://学术资讯
          case 'booking'://门票预订
          case 'exhibit_plan'://展览计划
            this.show_footer = false;
            break;
          default:
            this.show_footer = true;
            break;
        }
      }
    },
  }
</script>

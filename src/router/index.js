import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')// 首页
  }, {
    path: '/collection',
    name: 'collection',
    component: () => import('../views/Collection.vue')//典藏文物
  }, {
    path: '/collect_list',
    name: 'collect_list',
    component: () => import('../views/CollectionList.vue')//文物列表
  }, {
    path: '/detail_collect',
    name: 'detail_collect',
    component: () => import( '../views/DetailCollection.vue')// 藏品详情
  }, {
    path: '/academic',
    name: 'academic',
    component: () => import('../views/Academic.vue')//学术研究
  }, {
    path: '/study_article',
    name: 'study_article',
    component: () => import('../views/AcademicArticle.vue')//学术资讯
  }, {
    path: '/detail_study_article',
    name: 'detail_study_article',
    component: () => import('../views/DetailStudyArticle.vue')//学术资讯详情
  }, {
    path: '/books',
    name: 'books',
    component: () => import('../views/AcademicBooks.vue')//出版书籍列表页
  }, {
    path: '/committee',
    name: 'committee',
    component: () => import('../views/DetailCommittee.vue')//学术委员会
  }, {
    path: '/edu_active',
    name: 'edu_active',
    component: () => import('../views/EduActive.vue')//教育活动
  }, {
    path: '/edu_active_list',
    name: 'edu_active_list',
    component: () => import('../views/EduActiveList.vue')//教育活动列表
  }, {
    path: '/service',
    name: 'service',
    component: () => import('../views/Service.vue')//观众服务
  }, {
    path: '/explain',
    name: 'explain',
    component: () => import('../views/Explain.vue')//观众服务讲解预约
  }, {
    path: '/activity',
    name: 'activity',
    component: () => import( '../views/Activity.vue')// 活动预约
  }, {
    path: '/activity_input',
    name: 'activity_input',
    component: () => import( '../views/ActivityInput.vue')// 活动预约填写信息
  }, {
    path: '/activity_check',
    name: 'activity_check',
    component: () => import( '../views/ActivityCheck.vue')// 活动预约订单核销页面
  }, {
    path: '/activity_check_history',
    name: 'activity_check_history',
    component: () => import( '../views/ActivityCheckHistory.vue')// 活动预约订单核销历史
  }, {
    path: '/detail_activity',
    name: 'detail_activity',
    component: () => import( '../views/DetailActivity.vue')// 活动预约详情
  }, {
    path: '/news',
    name: 'news',
    component: () => import( '../views/News.vue')// 新闻资讯
  }, {
    path: '/detail_news',
    name: 'detail_news',
    component: () => import( '../views/DetailNew.vue')// 新闻详情
  }, {
    path: '/about',
    name: 'about',
    component: () => import( '../views/About.vue')// 关于我们
  }, {
    path: '/exhibition',
    name: 'exhibition',
    component: () => import( '../views/Exhibition.vue')// 陈列展览
  }, {
    path: '/exhibit_standing',
    name: 'exhibit_standing',
    component: () => import( '../views/ExhibitStanding.vue')// 常设展览
  }, {
    path: '/exhibit_temp',
    name: 'exhibit_temp',
    component: () => import( '../views/ExhibitTemp.vue')// 临时展览
  }, {
    path: '/exhibit_plan',
    name: 'exhibit_plan',
    component: () => import('../views/ExhibitPlan.vue')//展览计划
  }, {
    path: '/detail_exhibit',
    name: 'detail_exhibit',
    component: () => import('../views/DetailExhibition.vue')//展览详情
  }, {
    path: '/detail_plan',
    name: 'detail_plan',
    component: () => import('../views/DetailPlan.vue')//展览计划详情
  }, {
    path: '/products',
    name: 'products',
    component: () => import('../views/Products.vue')//文创赏析
  }, {
    path: '/login',
    name: 'login',
    component: () => import( '../views/Login.vue')// 登录页
  }, {
    path: '/ticket',
    name: 'ticket',
    component: () => import('../views/Ticket.vue')// 门票
  }, {
    path: '/booking',
    name: 'booking',
    component: () => import( '../views/TicketBooking.vue')// 门票预订
  }, {
    path: '/history',
    name: 'history',
    component: () => import( '../views/TicketHistory.vue')// 历史订单(暂无使用)
  }, {
    path: '/detail_ticket',
    name: 'detail_ticket',
    component: () => import( '../views/DetailTicket.vue')// 订单详情
  }, {
    path: '/ticket_check',
    name: 'ticket_check',
    component: () => import( '../views/TicketCheck.vue')// 扫码核销页(暂无使用)
  }, {
    path: '/check_history',
    name: 'check_history',
    component: () => import( '../views/TicketCheckHistory.vue')// 我的核销历史页(暂无使用)
  }, {
    path: '/mine',
    name: 'mine',
    component: () => import( '../views/Mine.vue')// 个人中心页
  }, {
    path: '/pay',
    name: 'pay',
    component: () => import( '../views/Pay.vue')// 支付页
  }, {
    path: '/mine_activity',
    name: 'mine_activity',
    component: () => import( '../views/DetailMineActivity.vue')// 个人中心活动预约列表
  }, {
    path: '/friend_link',
    name: 'friend_link',
    component: () => import('../views/FriendlyLink.vue')//友情链接
  }, {
    path: '/center',
    name: 'center',
    component: () => import( '../views/Center.vue')// 中间辅助跳转页
  }, {
    path: '/search',
    name: 'search',
    component: () => import( '../views/Search.vue')//搜索页
  }, {
    path: '/statement',
    name: 'statement',
    component: () => import('../views/Statement.vue')//相关声明
  }, {
    path: '/web_map',
    name: 'web_map',
    component: () => import('../views/WebMap.vue')//网站地图
  }
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

export default router

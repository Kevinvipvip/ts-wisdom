import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')// 首页
  }, {
    path: '/about',
    name: 'about',
    component: () => import( '../views/About.vue')// 关于我们
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
    component: () => import( '../views/TicketHistory.vue')// 历史订单
  }, {
    path: '/ticket_detail',
    name: 'ticket_detail',
    component: () => import( '../views/TicketDetail.vue')// 订单详情
  }, {
    path: '/ticket_check',
    name: 'ticket_check',
    component: () => import( '../views/TicketCheck.vue')// 扫码核销页
  }, {
    path: '/check_history',
    name: 'check_history',
    component: () => import( '../views/TicketCheckHistory.vue')// 我的核销历史页
  }
];

const router = new VueRouter({
  routes
});

export default router

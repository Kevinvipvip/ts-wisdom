<template>
  <div class="check-history page">
    <div class="common-title">我的核销历史</div>
    <!--<van-list-->
    <!--v-model="loading"-->
    <!--:finished="finished"-->
    <!--finished-text="没有更多了"-->
    <!--@load="load_more">-->
    <!--</van-list>-->
    <ul>
      <li v-for="item in check_list" :key="item.id">
        <p>{{item.name}}</p>
        <p>身份证号：{{item.idcard}}</p>
        <p>所属订单号：{{item.pay_order_sn}}</p>
        <p>预约时间：{{item.create_time}}</p>
        <p>核销时间：{{item.check_time}}</p>
        <p>入馆时间：{{item.use_date}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        check_list: [],
        count: 0,

        page: 0,//当前页码
        perpage: 10000,//每页请求的条数

        loading: false,
        finished: false,
      };
    },
    mounted() {
      this.getCheckList(1);
    },
    methods: {
      // load_more() {
      //   this.page++;
      //   this.getCheckList(this.page, () => {
      //     this.loading = false;
      //   });
      // },
      getCheckList(page, complete) {
        let post = {
          page: page,
          perpage: this.perpage
        };
        this.utils.ajax(this, 'my/getCheckList', post).then((list) => {
          if (list.length < this.perpage) {
            this.finished = true;
          }
          for (let i = 0; i < list.length; i++) {
            list[i].create_time = this.utils.date_format(list[i].create_time, 'yyyy-MM-dd hh:mm:ss');
            list[i].check_time = this.utils.date_format(list[i].check_time, 'yyyy-MM-dd hh:mm:ss');
            // this.check_list.push(list[i]);
          }
          console.log(list);
          this.check_list = list;
        }).then(() => {
          complete();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .check-history {
    ul {
      margin: 30px 24px;

      li {
        margin-bottom: 24px;
        background-color: #ffffff;
        box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
        padding: 25px;
        box-sizing: border-box;

        p {
          font-size: 28px;
          color: #333333;
          margin: 10px 0;
        }
      }
    }
  }
</style>

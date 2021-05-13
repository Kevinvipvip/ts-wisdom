<template>
  <div class="booking no-footer-page">
    <div class="input-title" :style="'background-image: url('+title_bg+')'">
      <div class="tip">
        <div class="tip-item" :class="operate1?'on':''"><span>1</span>
          <p>填写信息</p></div>
        <div class="line"></div>
        <div class="tip-item" :class="operate2?'on':''"><span>2</span>
          <p>预约确认</p></div>
        <div class="line"></div>
        <div class="tip-item" :class="operate3?'on':''"><span>3</span>
          <p>预约结果</p></div>
      </div>
    </div>

    <div class="one" v-if="tip_on===1">
      <div class="paiqi-box">
        <div class="paiqi">
          <van-cell title="参观日期" :value="date" @click="show_calender" value-class="date-color" is-link/>
          <van-calendar
                  color="#b38146"
                  v-model="show"
                  v-if="paiqi.length>0"
                  :min-date="new Date(paiqi[0].use_date)"
                  :max-date="new Date(paiqi[paiqi.length-1].use_date)"
                  @confirm="onConfirm"
                  :formatter="formatter"/>
        </div>
      </div>

      <div class="ticket-interval white" v-if="show_interval">
        <h3>入馆时段</h3>
        <ul>
          <li v-for="(item,index) in paiqi_detail" :key="'paiqi-detail'+index" :class="interval_id===item.id?'on':''">
            <p v-if="parseInt(item.surplus)===0">
              <span>{{item.start_time}} - {{item.end_time}}</span>
              <span>余{{item.surplus}}</span>
            </p>
            <p v-else @click="choice_interval(item.id)">
              <span>{{item.start_time}} - {{item.end_time}}</span>
              <span>余{{item.surplus}}</span>
            </p>
          </li>
        </ul>
      </div>

      <div class="tourist-info">
        <h3>常用人员</h3>
        <ul v-if="tourist.length">
          <li v-for="(item,index) in tourist" :key="item.id" @click="choise_tourist(index)">
            <p :class="item.checked?'on':''">{{item.name}}</p>
          </li>
        </ul>
        <div class="tip" v-else>未添加常用人员</div>
        <div class="btn-add" @click="fn_add_tourist"><i></i><span>添加人员</span></div>
      </div>

      <div class="choice-list" v-if="choice_tourist.length">
        <h3>已选择</h3>
        <div class="choice-item" v-for="(item,index) in choice_tourist" :key="'cyr'+index">
          <div class="delete" @click="delete_choice_tourist(item.idcard)"></div>
          <p><span>{{item.name}}</span><span>普通门票</span><span>免费</span></p>
          <p>身份证：{{item.idcard}}</p>
        </div>
      </div>
      <div class="btn-submit" @click="fn_next">下一步</div>
    </div>
    <div class="two" v-if="tip_on===2">
      <div class="two-date">
        <p>参观日期</p>
        <span>{{two_date}}</span>
      </div>
      <div class="choice-list" v-if="choice_tourist.length">
        <h3>参观人</h3>
        <div class="choice-item" v-for="(item,index) in choice_tourist" :key="'cyr'+index">
          <p><span>{{item.name}}</span><span>普通门票</span><span>免费</span></p>
          <p>身份证：{{item.idcard}}</p>
        </div>
      </div>
      <div class="btn-submit two-btn">
        <div class="btn1" @click="prev">返回修改</div>
        <div class="btn2" @click="submit" v-if="btn_click">确定预约</div>
        <div class="btn2 none-click" v-else>确定预约</div>
      </div>
    </div>
    <div class="three white" v-if="tip_on===3">
      <div class="icon"><img src="../assets/icons/orders-succ.png" alt=""></div>
      <div class="p-box">
        <p>您 【{{succ_date}}】 的参观门票已预约成功</p>
        <p>请参观当日凭预约时填写的证件到馆参观</p>
      </div>
    </div>
    <div class="btn-three" v-if="tip_on===3">
      <router-link :to="{path:'/center',query:{tip:1}}">继续预约</router-link>
      <router-link :to="{path:'/mine',query:{on:1}}">查看订单</router-link>
    </div>

    <!--弹出添加游客-->
    <div class="add-tourist" @click="add_tour = false" :class="add_tour?'show':''">
      <div class="add-cont" @click.stop>
        <h3>观众信息</h3>
        <div class="input">
          <label>门票类型</label>
          <div class="check-box">
            <div class="check"><img :src="check_img_one"/></div>
            <span>普通观众</span>
          </div>
        </div>
        <div class="input">
          <label for="name">观众姓名</label>
          <div class="ipt-box"><input type="text" checked id="name" v-model="name" placeholder="请输入姓名"></div>
        </div>
        <div class="input">
          <label for="cardType">证件类型</label>
          <div class="ipt-box"><input type="text" checked id="cardType" disabled value="身份证"></div>
        </div>
        <div class="input">
          <label for="IDcard">证件号码</label>
          <div class="ipt-box"><input type="text" checked id="IDcard" onkeyup="value=value.replace(/[^\w]/g,'');"
                                      maxlength="18" v-model="IDcard" placeholder="请输入证件号码"></div>
        </div>
        <div class="input">
          <div class="check-box">
            <div class="check"><img :src="check_img_two"/></div>
            <span>免费参观凭证</span>
          </div>
          <p>免费</p>
        </div>

        <div class="btn-add-box">
          <p @click="fn_reset">重置</p>
          <p @click="fn_add">确认添加</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title_bg: this.config.aliyun + 'ts-static/wap/bg-activity-title.png',
        tip_on: 1,
        operate1: true,
        operate2: false,
        operate3: false,

        token: '',
        paiqi: [],
        date: '请选择',//选择成功显示的日期
        two_date: '',//第二部展示的日期
        succ_date: '',//预约成功显示的日期
        show: false, add_tour: false,

        paiqi_detail: [],//排期详情
        show_interval: false,//是否显示时段
        interval_id: 0,//选择的时段id

        comfig_type: 1,//是否是点击提交是弹出的日历，是则提示toast

        tourist: [],//观众列表
        choice_tourist: [],//已选择的观众列表
        btn_click: true,

        // 添加观众
        name: '',
        IDcard: '',
        check_img_one: this.config.aliyun + 'ts-static/wap/ticket-checked.png',
        check_img_two: this.config.aliyun + 'ts-static/wap/ticket-check.png'
      };
    },
    watch: {
      'paiqi_detail.length': {
        handler(newValue) {
          if (newValue === 0) {
            this.show_interval = false;
          } else {
            this.show_interval = true;
          }
        }
      }
    },
    // 跳转本页时参数变化后重新调取新闻公告详情数据
    beforeRouteUpdate(to, from, next) {
      this.tip_on = parseInt(to.query.tip) || 1;
      if (to.query.date) {
        this.date = to.query.date || '请选择';
        if (to.query.sd) {
          this.interval_id = parseInt(to.query.sd);
          this.getPaiqiDetail(parseInt(to.query.sd));
        }
      }
      this.fn_tip();
      this.token = localStorage.getItem('token');
      if (this.token) {
        this.getVisitorList();
      }
      next();
    },
    mounted() {
      this.tip_on = parseInt(this.$route.query.tip) || 1;
      if (this.$route.query.date) {
        this.date = this.$route.query.date || '请选择';
        if (this.$route.query.sd) {
          this.interval_id = parseInt(this.$route.query.sd);
          this.getPaiqiDetail(parseInt(this.$route.query.sd));
        }
      }
      this.fn_tip();
      this.token = localStorage.getItem('token');
      if (this.token) {
        this.getVisitorList();
      }
    },
    methods: {
      // 点击进行下一步
      fn_next() {
        if (this.token) {
          if (this.date === '请选择') {
            this.comfig_type = 2;
            this.get_calender();
          } else if (this.interval_id === 0) {
            this.$dialog.alert({
              message: "请选择入馆时段",
              confirmButtonColor: '#b38146'
            });
          } else if (this.choice_tourist.length <= 0) {
            this.$dialog.alert({
              message: "请选择或者添加参观者",
              confirmButtonColor: '#b38146'
            });
          } else {
            this.$router.push({
              name: 'center',
              query: {
                tip: 2, date: this.date, sd: this.interval_id, data: encodeURI(JSON.stringify(this.choice_tourist))
              }
            });
          }
        } else {
          this.$router.push({ name: 'login', query: { url: this.$route.path, params: this.$route.query } })
        }
      },
      // 返回修改
      prev() {
        this.$router.push({
          name: 'center',
          query: { tip: 1, date: this.date, sd: this.interval_id, data: encodeURI(JSON.stringify(this.choice_tourist)) }
        });
      },

      // 选择入馆时段
      choice_interval(id) {
        this.interval_id = id;
      },

      // 点击选择常用人员
      choise_tourist(index) {
        this.tourist[index].checked = !this.tourist[index].checked;
        this.fn_choice_tourist();
      },

      // 点击删除已选人员
      delete_choice_tourist(card) {
        this.fn_choice_tourist(card)
      },
      fn_tip() {
        switch (this.tip_on) {
          case 1:
            this.choice_tourist = [];
            this.operate1 = true;
            this.operate2 = false;
            this.operate3 = false;
            break;
          case 2:
            this.operate1 = true;
            this.operate2 = true;
            this.operate3 = false;
            break;
          case 3:
            this.operate1 = true;
            this.operate2 = true;
            this.operate3 = true;
            break;
        }
      },
      // 点击参观日期
      show_calender() {
        this.comfig_type = 1;
        this.interval_id = 0;
        this.get_calender()
      },

      // 点击添加参观者
      fn_add_tourist() {
        if (this.token) {
          this.add_tour = true;
        } else {
          this.$router.push({
            name: 'login',
            query: {
              url: this.$route.path,
              params: this.$route.query
            }
          })
        }
      },

      // 不传参数为选择常用人员；传card参数为删除已选择或者已添加的人员
      fn_choice_tourist(card) {
        let arr = this.tourist, choice_arr = [];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            if (arr[i].idcard === card) {
              arr[i].checked = false;
            } else {
              if (choice_arr.length < 6) {
                choice_arr.push(arr[i]);
              } else {
                this.$dialog.alert({
                  message: '一次只能为6名游客预约',
                  confirmButtonColor: '#b38146'
                }).then(() => {
                  arr[i].checked = false;
                });
              }
            }
          }
        }
        this.choice_tourist = choice_arr;
        this.tourist = arr;
      },

      // 点击重置按钮
      fn_reset() {
        this.name = '';
        this.IDcard = '';
      },
      // 点击确认添加按钮
      fn_add() {
        if (!this.name.trim()) {
          this.$toast("请输入姓名")
        } else if (!this.IDcard.trim()) {
          this.$toast("请输入证件号码")
        } else {
          let post = {
            name: this.name,
            idcard: this.IDcard
          };
          this.utils.ajax(this, 'ticket/addVisitor', post).then(res => {
            if (res) {
              this.$dialog.alert({
                message: '添加成功',
                confirmButtonColor: '#b38146'
              }).then(() => {
                this.name = '';
                this.IDcard = '';
                this.add_tour = false;
                post.id = parseInt(res);
                if (this.choice_tourist.length < 6) {
                  post.checked = true;
                  this.choice_tourist.push(post);
                } else {
                  post.checked = false;
                  this.$dialog.alert({
                    message: '一次只能为6名游客预约，此次添加只添加常用人员，未选中',
                    confirmButtonColor: '#b38146'
                  });
                }
                this.tourist.push(post);
              });
            }
          })
        }
      },
      // 点击删除按钮
      // fn_delete(IDcard) {
      //   this.utils.ajax(this, 'ticket/visitorDelete', { idcard: IDcard }).then(() => {
      //     this.$dialog.alert({
      //       message: '已删除',
      //       confirmButtonColor: '#b38146'
      //     }).then(() => {
      //       this.getVisitorList();
      //     });
      //   })
      // },
      getVisitorList() {
        this.utils.ajax(this, 'ticket/visitorList').then(list => {
          for (let i = 0; i < list.length; i++) {
            list[i].checked = false;
          }
          this.tourist = list;
        }).then(() => {
          if (this.$route.query.data) {
            this.choice_tourist = JSON.parse(decodeURI(this.$route.query.data));
            for (let i = 0; i < this.tourist.length; i++) {
              for (let j = 0; j < this.choice_tourist.length; j++) {
                if (this.tourist[i].idcard === this.choice_tourist[j].idcard) {
                  this.tourist[i].checked = true;
                }
              }
            }
          }
        });
      },
      // 获取提交的参观人id
      submitVisitor() {
        let arr = [];
        for (let i = 0; i < this.choice_tourist.length; i++) {
          arr.push(this.choice_tourist[i].id);
        }
        return arr.join(',');
      },
      // 点击预约按钮
      submit() {
        if (this.btn_click) {
          this.btn_click = false;
          let data = {
            time_id: this.interval_id,
            visitor_ids: this.submitVisitor()
          };
          this.$dialog.confirm({
            message: '您总共预约了' + this.choice_tourist.length + '个人的门票',
            confirmButtonColor: '#b38146'
          }).then(() => {
            this.utils.ajax(this, 'ticket/purchase', data, [46, 55, 56]).then(() => {
              this.btn_click = true;
              this.$router.push({ name: 'center', query: { tip: 3, date: this.date, sd: this.interval_id } });
              // this.$dialog.confirm({
              //   message: "预约成功",
              //   confirmButtonText: "查看订单",
              //   confirmButtonColor: '#b38146',
              //   cancelButtonText: "继续预约",
              //   cancelButtonColor: '#b38146'
              // }).then(() => {
              //   this.btn_click = true;
              //   this.$router.push({ name: 'mine', query: { on: 1 } });
              // }).catch(() => {
              //   this.btn_click = true;
              //   this.date = '';
              //   this.submit_date = '';
              //   this.tourist = [];
              // });
            }).catch(err => {
              let text;
              if (this.choice_tourist.length > 5) {
                text = err.message;
              } else {
                text = err.data;
              }
              this.$dialog.alert({
                message: text,
                confirmButtonColor: '#b38146'
              }).then(() => {
                this.btn_click = true
              });
            });
          }).catch(() => {
            this.btn_click = true;
          });
        }
      },
      formatDate(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString()[1] ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate().toString()[1] ? date.getDate() : '0' + date.getDate()}`
      },
      onConfirm(date) {
        this.show = false;
        this.btn_click = true;
        this.date = this.formatDate(date);
        if (this.comfig_type === 2) {
          this.$toast('日期选择成功，再次点击进入下一步');
        }
        this.getPaiqiDetail();
      },
      formatter(day) {
        let date_str = this.utils.date_format(day.date, 'yyyy-MM-dd');
        for (let i = 0; i < this.paiqi.length; i++) {
          if (date_str === this.paiqi[i].use_date) {
            if (this.paiqi[i].status == 0) {
              day.bottomInfo = this.paiqi[i].desc;
              day.type = 'disabled';
            } else {
              if (this.paiqi[i].surplus <= 0) {
                day.bottomInfo = '已满';
                day.type = 'disabled';
              } else {
                day.bottomInfo = '余' + this.paiqi[i].surplus;
              }
            }
            return day
          }
        }
        if (date_str > this.paiqi[0].use_date && date_str < this.paiqi[this.paiqi.length - 1].use_date) {
          day.bottomInfo = '无';
          day.type = 'disabled';
        }
        return day;
      },
      get_calender() {
        this.utils.ajax(this, 'ticket/paiqiList').then((res) => {
          if (res.length > 0) {
            this.paiqi = res;
            this.show = true
          } else {
            this.$dialog.alert({
              message: '馆方还没有开放售票，敬请期待',
              confirmButtonColor: '#b38146'
            })
          }
        })
      },
      getPaiqiDetail(id) {
        this.utils.ajax(this, 'ticket/paiqiDetail', { use_date: this.date }).then((res) => {
          if (res.time_list.length) {
            this.show_interval = true;
            this.paiqi_detail = res.time_list;
            if (id) {
              for (let i = 0; i < res.time_list.length; i++) {
                if (res.time_list[i].id === id) {
                  this.two_date = res.use_date + " " + res.time_list[i].start_time + "-" + res.time_list[i].end_time;
                  if (this.date !== '请选择')
                    this.succ_date = this.utils.date_format(new Date(this.date), 'MM月dd日 周w') + " " + res.time_list[i].start_time + "-" + res.time_list[i].end_time;
                }
              }
            }
          } else {
            this.show_interval = false;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .booking {
    .paiqi-box {
      height: 100px;
      margin: 14px 0;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      overflow: hidden;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
    }

    .paiqi-box .paiqi {
      width: 100%;
      margin: 0 26px;

      .van-cell--clickable:active {
        background-color: transparent;
      }

      .van-cell {
        font-size: 34px;
        color: #333333;

        .van-cell__title {
          flex-shrink: 0;
          flex: unset;
          margin-right: 27px;
        }

        .date-color {
          text-align: right;
          font-size: 24px;
          color: #d0a34d;
        }

        .van-cell__right-icon {
          color: #d0a34d;
          font-size: 24px;
        }

        &:not(:last-child)::after {
          border: none;
        }
      }
    }

    .ticket-interval {
      margin-bottom: 14px;
      overflow: hidden;

      h3 {
        margin: 40px 26px 0;
        font-size: 32px;
        color: #333333;
        font-weight: normal;
      }

      ul {
        display: flex;
        align-items: center;
        margin: 40px 26px;
        flex-wrap: wrap;

        li {
          border-radius: 10px;
          border: 2px solid #efefef;
          margin: 20px;
          color: #666666;

          p {
            padding: 10px 20px;
            font-size: 26px;

            span:first-child {
              margin-right: 40px;
            }
          }

          &.on {
            color: #cf903a;
            border-color: #cf903a;
          }
        }
      }
    }

    .tourist-info {
      overflow: hidden;
      box-sizing: border-box;
      background-color: #ffffff;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);

      h3 {
        margin: 40px 26px 0;
        font-size: 32px;
        color: #333333;
        font-weight: normal;
      }

      ul, .tip {
        display: flex;
        flex-wrap: wrap;
        margin: 60px 26px 40px;
        font-size: 28px;
        color: #666666;

        li {
          margin-right: 60px;
          margin-bottom: 24px;

          p {
            font-size: 28px;
            color: #333333;
            padding-left: 49px;
            background-image: url("../assets/icons/checkBox.png");
            background-size: 34px 34px;
            background-position: left;
            background-repeat: no-repeat;

            &.on {
              background-image: url("../assets/icons/checkBox-checked.png");
            }
          }
        }
      }

      .btn-add {
        height: 80px;
        background-color: #cf903a;
        font-size: 30px;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
          display: block;
          width: 34px;
          height: 34px;
          margin-right: 10px;
          background-image: url("../assets/icons/add.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;
        }
      }
    }

    .choice-list {
      background-color: #ffffff;
      margin-top: 14px;
      margin-bottom: 124px;
      padding: 40px 24px;

      h3 {
        font-size: 32px;
        color: #333333;
        font-weight: normal;
      }

      .choice-item {
        margin-top: 24px;
        border-radius: 10px;
        border: solid 1px #cf903a;
        padding: 30px;
        position: relative;

        .delete {
          position: absolute;
          right: 30px;
          top: 30px;
          width: 29px;
          height: 34px;
          background-image: url("../assets/icons/delete.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-position: center;
        }

        p {
          font-size: 26px;
          color: #333333;
          display: flex;
          align-items: center;
          line-height: 51px;

          span {
            display: block;
            margin-right: 25px;
          }
        }
      }
    }

    .two-date {
      display: flex;
      font-size: 34px;
      align-items: center;
      justify-content: space-between;
      height: 100px;
      background-color: #ffffff;
      padding: 0 26px;
      margin-top: 14px;

      p {
        color: #333333;
        font-weight: bold;
      }

      span {
        color: #d0a34d;
      }
    }

    .three {
      margin-top: 14px;
      display: flex;
      flex-flow: column;
      align-items: center;
      overflow: hidden;

      .icon {
        margin: 69px 0 37px;
        width: 70px;
        height: 70px;
      }

      .p-box {
        margin-bottom: 69px;

        p {
          font-size: 28px;
          color: #666666;
          text-align: center;
          line-height: 42px;
        }
      }
    }

    .btn-three {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 120px;

      a {
        margin: 0 35px;
        display: block;
        width: 260px;
        height: 80px;
        background-color: #cf903a;
        font-size: 28px;
        color: #ffffff;
        text-align: center;
        line-height: 80px;
        border-radius: 10px;
        box-sizing: border-box;

        &:first-child {
          color: #cf903a;
          background-color: #ffffff;
          border: 2px solid #cf903a;
        }
      }
    }

    .add-tourist {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      opacity: 0;

      .add-cont {
        background-color: #ffffff;
        transition: 0.5s;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0;

        h3 {
          text-align: center;
          margin: 30px 0;
          font-size: 28px;
          font-weight: normal;
          color: #000;
        }

        .input {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          margin: 0 30px 18px;

          label {
            margin-right: 27px;
            font-size: 28px;
            color: #584e43;
            flex-shrink: 0;
          }

          .ipt-box {
            flex-grow: 1;
            height: 100%;
            border: solid 2px #b5b5b5;
            box-sizing: border-box;
            padding: 0 15px;

            input {
              display: block;
              font-size: 28px;
              color: #000;
              background: unset;
              outline: none;
              height: 100%;
              width: 100%;
              border: none;
            }
          }

          .check-box {
            flex-grow: 1;
            display: flex;
            align-items: center;

            .check {
              width: 24px;
              height: 24px;
              border: solid 2px #b38146;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 10px;
            }

            span {
              font-size: 28px;
              color: #000;
            }
          }

          p {
            font-size: 30px;
            color: #000;
          }
        }

        .btn-add-box {
          display: flex;
          height: 98px;

          p {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            background-color: rgb(179, 129, 70);
            font-size: 28px;
            color: #ffffff;
            box-sizing: border-box;

            &:first-child {
              border-right: 2px solid rgb(126, 65, 19);
            }
          }
        }
      }

      &.show {
        opacity: 1;
        z-index: 2001;

        .add-cont {
          height: 581px;
        }
      }
    }

    .btn-submit {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 34px;
      color: #ffffff;
      background-color: #cf903a;
      z-index: 33;

      .btn1, .btn2 {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .btn1 {
        color: #cf903a;
        background-color: #ffffff;
        border: 2px solid #cf903a;
        box-sizing: border-box;
      }
    }
  }
</style>

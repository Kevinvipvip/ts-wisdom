<template>
  <div class="login no-footer-page">
    <!--<div class="common-title">填写账号信息</div>-->
    <div class="login-cont" :style="'background-image: url('+bg+')'">
      <div class="login-box">
        <div class="title"><h1>填写账号信息</h1></div>
        <div class="input">
          <!--<label for="tel">手机号</label>-->
          <div class="ipt-box"><input type="text" v-model="tel" id="tel" maxlength="11" placeholder="请输入手机号"
                                      @blur="blur_reg_tel" oninput="value=value.replace(/[^\d]/g,'')"></div>
        </div>
        <div class="input">
          <!--<label for="save">安全码</label>-->
          <div class="ipt-box"><input type="text" placeholder="请输入安全码" v-model="save" id="save"
                                      onkeyup="value=value.replace(/[^\w]/g,'');">
          </div>
          <div class="img" @click="change_save"><img :src="save_img"/></div>
        </div>
        <div class="input">
          <!--<label for="code">验证码</label>-->
          <div class="ipt-box"><input type="number" v-model="code" placeholder="请输入验证码" id="code"></div>
          <div class="btn-code" @click="get_code" v-if="code_is_click">获取验证码</div>
          <div class="btn-code desable" v-else>重新获取({{clock}}s)</div>
        </div>

        <div class="btn btn-login" @click="login">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        save_img: 'https://ts.wcip.net/api/login/getVCode',

        bg: this.config.aliyun + 'ts-static/wap/bg-login.png',

        tel: '',
        save: '',
        code: '',
        code_is_click: true,
        no_second: true,
        clock: 60
      };
    },
    mounted() {
      // console.log(this.$route.query)
      // console.log(this.$route)
    },
    methods: {
      change_save() {
        let random = Math.random();
        this.save_img = this.save_img + '?' + random;
        this.save = '';
      },

      get_code() {//获取短信验证码
        if (!this.tel.trim()) {
          this.$toast("请输入手机号")
        } else if (!this.save.trim()) {
          this.$toast("请输入安全码")
        } else if (!this.config.tel_reg.test(this.tel)) {
          this.$toast("请输入正确的手机号");
        } else {
          if (this.no_second) {
            this.no_second = false;
            this.utils.ajax(this, 'login/sendSms', { tel: this.tel, vcode: this.save }, [47]).then(() => {
              this.$dialog.alert({
                message: '短信已发送',
                confirmButtonColor: '#b38146'
              }).then(() => {
                this.code_is_click = false;
                let interval = setInterval(() => {
                  this.clock--;
                  if (this.clock === 0) {
                    this.code_is_click = true;
                    this.no_second = true;
                    this.clock = 60;
                    window.clearInterval(interval)
                  }
                }, 1000);
              });
            }).catch((err) => {
              this.$dialog.alert({
                message: err.data,
                confirmButtonColor: '#b38146'
              }).then(() => {
                this.no_second = true;
              })
            });
          }
        }
      },
      login() {
        if (!this.tel.trim()) {
          this.$toast("请输入手机号")
        } else if (!this.save.trim()) {
          this.$toast("请输入安全码")
        } else if (!this.code.trim()) {
          this.$toast("请输入验证码")
        } else if (!this.config.tel_reg.test(this.tel)) {
          this.$toast("请输入正确的手机号");
        } else {
          let post = { tel: this.tel, code: this.code };
          this.utils.ajax(this, 'login/bindUser', post).then(res => {
            console.log(res);
            localStorage.setItem('token', res.token);
            localStorage.setItem('tel', res.tel);
            this.$dialog.alert({
              message: '登录成功',
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.$router.replace({
                path: this.$route.query.url,
                query: this.$route.query.params
              })
            });
          });
        }
      },
      // 验证电话号码
      blur_reg_tel() {
        if (this.tel) {
          if (!this.config.tel_reg.test(this.tel)) {
            this.$toast("请输入正确的手机号");
          }
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  .login {
    /*background-color: #e7e1c9;*/
    background-color: rgba(231, 225, 201, 0.3);

    .login-cont {
      overflow: hidden;
      width: 100%;
      height: calc(100vh - 88px);
      background-position: bottom;
      background-repeat: no-repeat;
      background-size: 100%;

      .login-box {
        padding: 26px 24px 67px;
        box-sizing: border-box;
        background-color: #ffffff;
        /*width: calc(100% - );*/
        margin: 100px 75px 0;
        border-radius: 10px;
        box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);

        .input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          margin: 20px 40px 0;
          border-radius: 10px;
          border: solid 2px #eeeeee;

          /*label {*/
          /*width: 100px;*/
          /*flex-shrink: 0;*/
          /*display: block;*/
          /*color: #584e43;*/
          /*font-size: 30px;*/
          /*margin-right: 30px;*/
          /*}*/

          .ipt-box {
            flex-grow: 1;
            height: 100%;
            padding: 0 30px;
            box-sizing: border-box;

            input {
              width: 100%;
              display: block;
              font-size: 26px;
              color: #999999;
              outline: none;
              border: none;
              background: none;
              height: 100%;

              &:-webkit-autofill {
                box-shadow: 0 0 0 1000px #ffffff inset
              }
            }
          }

          .img {
            height: 50px;
            flex-shrink: 0;
            /*margin-left: 24px;*/

            img {
              width: auto;
              height: 100%;
            }
          }

          .btn-code {
            margin-left: 24px;
            /*background-color: #b38146;*/
            color: #cf903a;
            font-size: 26px;
            height: 100%;
            padding-right: 31px;
            box-sizing: border-box;
            flex-shrink: 0;
            display: flex;
            align-items: center;

            &.desable {
              color: #999999;
            }
          }
        }

        .btn {
          font-size: 34px;
          line-height: 80px;
          text-align: center;
          width: 460px;
          height: 80px;
          color: #ffffff;
          background-color: #cf903a;
          box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
          border-radius: 10px;
          margin: 80px auto 0;
        }
      }
    }
  }
</style>

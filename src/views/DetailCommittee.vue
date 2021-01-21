<template>
  <div class="detail-committee page">
    <div class="tab">
      <div class="tab-item" :class="tab_on===1?'tab-on':''" @click="click_tab(1)">章程</div>
      <div class="tab-item" :class="tab_on===2?'tab-on':''" @click="click_tab(2)">工作规程</div>
      <div class="tab-item" :class="tab_on===3?'tab-on':''" @click="click_tab(3)">成员名录</div>
    </div>

    <!--选择成员名录时显示-->
    <div class="member white" v-if="tab_on === 3">
      <div class="committee-title">唐山博物馆学术委员会成员名录</div>
      <ul>
        <li v-for="(item,index) in member" :key="'member'+index">
          <div class="img" :style="'background-image:url('+item.pic+')'"></div>
          <div class="member-cont">
            <h2>{{item.name}} | {{item.title1}}</h2>
            <div>
              <p>姓名：{{item.name}}</p>
              <p>学历：{{item.edu}}</p>
              <p>性别：{{item.sex===1?'男':'女'}}</p>
              <p>学位：{{item.degree}}</p>
              <p>年龄：{{item.age}}</p>
              <p>单位：{{item.museum}}</p>
              <p>民族：{{item.nation}}</p>
              <p>现任职称：{{item.title2}}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="rules white" v-else>
      <!--选中工作流程时显示-->
      <div class="rules-item" v-if="tab_on === 2">
        <div class="committee-title">唐山博物馆学术委员会工作规程</div>
        <p>{{rules.rules}}</p>
      </div>
      <!--选中章程时显示-->
      <div class="rules-item" v-else>
        <div class="committee-title">唐山博物馆学术委员会章程</div>
        <p>{{rules.standard}}</p>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_on: 1,

        rules: {},//章程和工作规则数据

        member: [],//成员名录列表
      };
    },
    mounted() {
      this.tab_on = parseInt(this.$route.query.on) || 1;
      this.getStudyRules();
      this.getStudyMemberList();
    },
    methods: {
      click_tab(tab) {
        this.$router.replace({ name: 'center', query: { on: tab } });
      },

      // 获取学术委员会章程和工作规范
      getStudyRules() {
        this.utils.ajax(this, 'study/studyRules').then(res => {
          this.rules = res;
        })
      },

      // 获取学术委员会成员名录
      getStudyMemberList() {
        this.utils.ajax(this, 'study/studyMemberList').then(res => {
          this.utils.aliyun_format(res.list);
          this.member = res.list;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .detail-committee {
    .committee-title {
      font-size: 34px;
      color: #000000;
      opacity: 0.9;
      padding-bottom: 40px;
      margin: 40px 24px;
      text-align: center;
      border-bottom: 2px solid #efefef;
    }

    .tab {
      margin: 40px 0 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .tab-item {
        margin: 0 30px;
        font-size: 28px;
        color: #666666;
        padding-bottom: 24px;
        position: relative;

        &.tab-on {
          color: #cf903a;

          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #cf903a;
            border-radius: 2px;
          }
        }
      }
    }

    .member {
      overflow: hidden;
      margin-bottom: 14px;

      ul {
        margin: 0 24px 100px;

        li {
          display: flex;
          align-items: center;
          margin-bottom: 30px;

          .img {
            width: 265px;
            height: 371px;
            margin-right: 24px;
            flex-shrink: 0;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }

          .member-cont {
            flex-grow: 1;
            display: flex;
            flex-flow: column;
            justify-content: space-between;

            h2 {
              font-size: 28px;
              font-weight: normal;
              margin-bottom: 20px;
            }

            p {
              line-height: 39px;
              font-size: 26px;
              color: #666666;
            }
          }
        }
      }
    }

    .rules {
      overflow: hidden;
      margin-bottom: 14px;

      .rules-item {
        margin: 0 24px 128px;

        p {
          white-space: pre-line;
          text-align: justify;
          font-size: 28px;
          color: #666666;
        }
      }
    }
  }
</style>

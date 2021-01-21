<template>
  <div class="search no-footer-page" @click="show_select=false">
    <div class="search-ipt white">
      <div class="input-box">
        <div class="select-box" @click.stop="show_select=!show_select">
          <div class="select">{{select_text}}</div>
          <div class="select-item-box" @click.stop :class="show_select?'show-select':''">
            <div class="select-item" @click.stop="click_select('藏品')">藏品</div>
            <div class="select-item" @click.stop="click_select('展览')">展览</div>
            <div class="select-item" @click.stop="click_select('活动')">活动</div>
            <div class="select-item" @click.stop="click_select('新闻')">新闻</div>
          </div>
        </div>
        <div class="ipt-box">
          <input type="text" placeholder="关键字" v-model="keyword" ref="input">
        </div>
        <div class="btn-search" @click.stop="search"><img src="../assets/icons/search.png"/></div>
      </div>
    </div>

    <!--搜索结果列表-->
    <div class="nodata" v-if="no_keyword"><span>请填写关键词后搜索</span></div>
    <div class="result" v-else-if="!nodata">

      <div class="collect-cont" v-if="type===1">
        <ul v-for="(item,index) in collect_list" :key="index">
          <li v-for="v in item.list" :key="'collect'+v.id" @click="to_more_detail(type,v.id)">
            <div class="img"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+')'}"></div>
            <div class="item-cont">
              <h3 class="one-line-ellipsis">{{v.title}}</h3>
              <p>{{v.dynasty}} | {{v.cate_name}}</p>
            </div>
          </li>
        </ul>
      </div>

      <ul class="temp-list white" v-else-if="type===2">
        <li v-for="(item,index) in result" :key="'result-temp'+index" @click="to_more_detail(type,item.id)">
          <div class="img" :style="'background-image: url('+item.cover+')'">
            <div class="tag" :class="'bg'+item.cate_id">{{item.tag}}</div>
          </div>
          <h3 class="one-line-ellipsis">{{item.title}}{{item.title}}</h3>
        </li>
      </ul>

      <ul class="com-active" v-else-if="type===3">
        <li v-for="(item,index) in result" :key="'result-active'+index"
            @click="to_more_detail(type,item.id)">
          <div class="img" :style="'background-image: url('+item.pic+')'">
            <div class="type">{{item.state}}</div>
          </div>
          <div class="cont">
            <h3 class="two-line-ellipsis">{{item.title}}</h3>
            <p>活动时间：{{item.start_time}} | 剩余名额：{{item.num}}人</p>
            <p>活动地点：{{item.address}}
              <span v-if="item.price==='0.00'" style="color:#33b089;">免费</span>
              <span v-else>￥{{item.price}}</span>
            </p>
          </div>
        </li>
      </ul>

      <ul class="com-news-list" v-else-if="type===4">
        <li v-for="(item,index) in result" :key="'result-news'+index" @click="to_more_detail(type,item.id)">
          <div class="img" :style="'background-image: url('+item.pic+')'"></div>
          <div class="cont">
            <h3 class="two-line-ellipsis">{{item.title}}</h3>
            <p>{{item.create_time}}</p>
            <span :class="'bg'+item.type">{{item.type_name}}</span>
          </div>
        </li>
      </ul>

    </div>
    <div class="nodata" v-else><span>没有搜索结果</span></div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        show_select: false,

        no_keyword: true,//是否填写了关键词
        keyword: '',//关键词
        select_text: '藏品',//搜索项
        type: 0,//当前显示的列表项

        result: [],//搜索结果
        nodata: true,

        //典藏文物列表
        collect_list: [
          {
            list: [],
            list_height: 0,
          }, {
            list: [],
            list_height: 0,
          }]
      };
    },
    mounted() {
    },
    methods: {
      // 点击选择搜索项
      click_select(title) {
        this.select_text = title;
        this.show_select = false;
      },

      // 点击搜索按钮实现搜索功能
      search() {
        this.collect_list = [
          {
            list: [],
            list_height: 0,
          }, {
            list: [],
            list_height: 0,
          }];
        this.result = [];
        switch (this.select_text) {
          case '藏品':
            this.type = 1;
            this.getSearchResult('api/collectList', {}, list => {
              this.utils.aliyun_format(list, 'cover');
              for (let i = 0; i < list.length; i++) {
                let index = this.utils.getMinIndex(this.collect_list);
                this.collect_list[index].list.push(list[i]);
                this.collect_list[index].list_height += list[i].height / list[i].width + 0.3599;
              }
              this.result = list;
            });
            break;
          case '展览':
            this.type = 2;
            this.getSearchResult('api/displayList', {}, list => {
              this.utils.aliyun_format(list, 'cover');
              for (let i = 0; i < list.length; i++) {
                list[i].start_time = this.utils.date_format(list[i].start_time, 'yyyy/MM/dd');
                list[i].end_time = this.utils.date_format(list[i].end_time, 'yyyy/MM/dd');
              }
              this.result = list;
            });
            break;
          case '活动':
            this.type = 3;
            this.getSearchResult('activity/activityList', {}, list => {
              this.utils.aliyun_format(list);
              for (let i = 0; i < list.length; i++) {
                list[i].start_time = this.utils.date_format(list[i].start_time, 'yyyy/MM/dd');
              }
              this.result = list;
            });
            break;
          case '新闻':
            this.type = 4;
            this.getSearchResult('api/articleList', {}, list => {
              this.utils.aliyun_format(list);
              for (let i = 0; i < list.length; i++) {
                list[i].create_time = this.utils.date_format(new Date(list[i].create_time), 'yyyy/MM/dd');
              }
              this.result = list;
            });
            break;
        }
      },

      // 点击分别前往相应的详情页
      to_more_detail(type, id) {
        let query = { id: id, from_type: 99, keyword: this.keyword, select: this.select_text };
        console.log(query)
        switch (type) {
          case 1:
            this.$router.replace({ name: 'detail_collect', query: query });
            break;
          case 2:
            this.$router.replace({ name: 'detail_exhibit', query: query });
            break;
          case 3:
            this.$router.replace({ name: 'detail_activity', query: query });
            break;
          case 4:
            this.$router.replace({ name: 'detail_news', query: query });
            break;
        }
      },
      // 获取搜索结果
      getSearchResult(url, data, complete) {
        let post = data || {};
        post.page = 1;
        post.perpage = 100;
        post.search = this.keyword;
        if (this.keyword) {
          this.no_keyword = false;
          this.utils.ajax(this, url, post).then(res => {
              if (res.list.length) {
                this.nodata = false;
                if (complete)
                  complete(res.list);
              } else {
                this.nodata = true;
              }
            }
          );
        } else {
          console.log('请填写关键词后搜索');
          this.no_keyword = true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .search {
    .search-ipt {
      margin-top: 5px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;

      .input-box {
        width: calc(100% - 24px);
        height: 60px;
        border-radius: 10px;
        border: solid 2px #cf903a;
        display: flex;
        justify-content: space-between;

        .select-box {
          width: 140px;
          height: 100%;
          flex-shrink: 0;
          border-right: 2px solid #cf903a;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          .select {
            /*width: 70px;*/
            padding-right: 42px;
            color: #333333;
            font-size: 26px;
            background-image: url("../assets/icons/triangle.png");
            background-position: right;
            background-repeat: no-repeat;
            background-size: 19px 10px;
          }

          .select-item-box {
            background-color: rgba(207, 144, 58, 0.8);
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            z-index: 99;
            overflow: hidden;
            height: 0;
            transition: 0.5s;
            display: flex;
            flex-flow: column;

            .select-item {
              height: 25%;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 26px;
              color: #ffffff;
            }

            &.show-select {
              height: 280px;
            }
          }
        }

        .ipt-box {
          flex-grow: 1;
          height: 100%;

          input {
            padding: 0 18px;
            outline: none;
            background: unset;
            border: none;
            display: block;
            font-size: 26px;
            color: #333333;
            height: 100%;
            box-sizing: border-box;
            width: 100%;
          }
        }

        .btn-search {
          cursor: pointer;
          flex-shrink: 0;
          width: 79px;
          height: 100%;
          border-left: 2px solid #cf903a;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 31px;
            height: 32px;
          }
        }
      }
    }

    .result {
      /*margin: 24px;*/
    }
  }
</style>

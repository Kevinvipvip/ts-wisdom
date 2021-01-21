<template>
  <div class="collection no-footer-page">
    <!--<div class="title">精品馆藏</div>-->

    <div class="picker-box">
      <div class="picker-item" @click="show_pop(1)">
        <p>{{choise_dynasty?choise_dynasty:'朝代'}}</p>
        <div class="icon"><img src="../assets/icons/s-nav-open.png" alt=""></div>
      </div>
      <div class="picker-item" @click="show_pop(2)">
        <p>{{cate_name?cate_name:'类别'}}</p>
        <div class="icon"><img src="../assets/icons/s-nav-open.png" alt=""></div>
      </div>

      <div class="collect-ipt-box">
        <div class="input"><input type="text" v-model="keyword" placeholder="输入关键词"></div>
        <div class="btn-search" @click="collect_search">搜索</div>
      </div>

      <van-popup v-model="showPicker" position="bottom" :close-on-click-overlay="false">
        <van-picker
                show-toolbar
                :default-index="default_index"
                :columns="columns"
                @cancel="showPicker = false"
                @confirm="onConfirm"
        />
      </van-popup>
    </div>

    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <div class="collect-cont">
        <ul v-for="(item,index) in collect_list" :key="index">
          <li v-for="v in item.list" :key="'collect'+v.id" @click="to_detail(v.id)">
            <div class="img"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+')'}"></div>
            <div class="item-cont">
              <h3 class="one-line-ellipsis">{{v.title}}</h3>
              <p>{{v.dynasty}} | {{v.cate_name}}</p>
            </div>
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [],//当前显示的选择项的数组
        default_index: 0,//默认选中项
        dynasty_index: 0,//朝代选中项
        cate_index: 0,//分类选中项


        cate: [],//分类
        dynasty: [],//朝代
        showPicker: false,//弹出层显隐

        choise_type: 0,//选择的类型
        choise_dynasty: '',//选中的朝代
        dynasty_id: '',//选中的朝代的id
        cate_name: '',//选中的分类的名称
        cate_id: 0,//选中的分类的id

        keyword: '',//输入的关键词

        //典藏文物列表
        collect_list: [
          {
            list: [],
            list_height: 0,
          }, {
            list: [],
            list_height: 0,
          }],
        page: 0,
        loading: false,
        finished: false,
        count: 0
      };
    },
    mounted() {
      this.dynasty_id = parseInt(this.$route.query.dynasty_id) || 0;
      this.cate_id = parseInt(this.$route.query.cate_id) || 0;
      this.getDynastyList();
      this.getCollectCateList();
    },
    methods: {
      // 重置数据的方法
      reset() {
        this.collect_list = [
          {
            list: [],
            list_height: 0,
          }, {
            list: [],
            list_height: 0,
          }];
        this.page = 0;
        this.loading = false;
        this.finished = false
      },
      onLoad() {
        this.page++;
        this.getCollectList(this.page, () => {
          this.loading = false;
          if ((this.collect_list[0].list.length + this.collect_list[1].list.length) >= this.count) {
            this.finished = true
          }
        })
      },

      // 点击出现选择项；type=1为选择朝代；type=2为选择分类
      show_pop(type) {
        this.showPicker = true;
        this.choise_type = type;
        if (type === 1) {
          this.columns = ['全部'];
          this.default_index = this.dynasty_index;
          for (let i = 0; i < this.dynasty.length; i++) {
            this.columns.push(this.dynasty[i].name);
          }
        } else {
          this.columns = ['全部'];
          this.default_index = this.cate_index;
          for (let i = 0; i < this.cate.length; i++) {
            this.columns.push(this.cate[i].cate_name);
          }
        }
      },

      // 选择点击确认后事件
      onConfirm(value, index) {
        this.reset();
        if (this.choise_type === 1) {
          this.choise_dynasty = value === '全部' ? '' : value;
          this.dynasty_index = index;
          if (value === '全部') {
            this.dynasty_id = 0;
          } else {
            for (let i = 0; i < this.dynasty.length; i++) {
              if (this.dynasty[i].name === value) {
                this.dynasty_id = this.dynasty[i].id;
              }
            }
          }
        } else {
          this.cate_name = value === '全部' ? '' : value;
          this.cate_index = index;
          if (value === '全部') {
            this.cate_id = 0;
          } else {
            for (let i = 0; i < this.cate.length; i++) {
              if (this.cate[i].cate_name === value) {
                this.cate_id = this.cate[i].id;
              }
            }
          }
        }
        this.showPicker = false;
        this.onLoad();
      },

      // 点击搜索按钮
      collect_search() {
        if (this.keyword !== '') {
          this.reset();
          this.onLoad();
        }
      },
      // 点击前往藏品详情
      to_detail(id) {
        this.$router.push({ name: 'detail_collect', query: { id: id } })
      },

      // 获取藏品数据
      getCollectList(page, callback) {
        let data = {
          dynasty: this.dynasty_id,
          cate_id: this.cate_id,
          search: this.keyword,
          page: page,
          perpage: 10
        };
        this.utils.ajax(this, 'api/collectList', data).then((obj) => {
          this.count = obj.count;
          this.utils.aliyun_format(obj.list, 'cover');
          for (let i = 0; i < obj.list.length; i++) {
            let index = this.utils.getMinIndex(this.collect_list);
            this.collect_list[index].list.push(obj.list[i]);
            this.collect_list[index].list_height += obj.list[i].height / obj.list[i].width + 0.3599;
          }
        }).then(() => {
          callback();
        })
      },

      // 获取朝代数据
      getDynastyList() {
        this.utils.ajax(this, 'api/dynastyList').then((arr) => {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === this.dynasty_id) {
              this.choise_dynasty = arr[i].name;
              this.dynasty_index = i + 1;
            }
          }
          this.dynasty = arr;
        })
      },
      // 获取分类数据
      getCollectCateList() {
        this.utils.ajax(this, 'api/collectCateList').then((arr) => {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === this.cate_id) {
              this.cate_name = arr[i].cate_name;
              this.cate_index = i + 1;
            }
          }
          this.cate = arr;
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  .collection {
    .picker-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 30px 24px;
      margin-top: 5px;
      background-color: #ffffff;

      .picker-item {
        width: 340px;
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-image: url("../assets/bgs/btn-white-339.png");
        background-position: center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 0 30px;
        box-sizing: border-box;

        p {
          font-size: 28px;
          color: #666666;
        }

        .icon {
          width: 40px;
          height: 25px;
        }
      }

      .collect-ipt-box {
        width: 701px;
        height: 80px;
        margin-top: 30px;
        background-image: url("../assets/bgs/btn-white-702.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .input {
          flex-grow: 1;
          height: 100%;
          padding: 0 31px;
          box-sizing: border-box;

          input {
            display: block;
            width: 100%;
            height: 100%;
            outline: none;
            background: transparent;
            border: none;
            font-size: 28px;
            color: #666666;
          }
        }

        .btn-search {
          width: 140px;
          height: 100%;
          font-size: 28px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
          color: #ffffff;
          background-image: url("../assets/bgs/btn-yellow-140.png");
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
    }
  }
</style>

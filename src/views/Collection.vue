<template>
  <div class="collection page">
    <!--<div class="title">精品馆藏</div>-->

    <div class="picker-box">
      <div class="picker-item" @click="show_pop(1)">
        <div class="icon"><img src="../assets/icon-dynasty.png"/></div>
        <p>{{choise_dynasty?choise_dynasty:'选择时代'}}</p>
        <van-icon size="14px" color="#333333" name="arrow-down"/>
      </div>
      <div class="picker-item" @click="show_pop(2)">
        <div class="icon"><img src="../assets/icon-cate.png"/></div>
        <p>{{cate_name?cate_name:'选择类别'}}</p>
        <van-icon size="14px" color="#333333" name="arrow-down"/>
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
      <div class="list-box">
        <ul>
          <li v-for="(v,index) in leftArray" :key="index">
            <div class="img" @click="to_detail(v.id)"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+'?x-oss-process=image/resize,w_750)'}"></div>
            <h3 class="one-line-ellipsis">{{v.title}}</h3>
            <p>{{v.dynasty}} | {{v.cate_name}}</p>
          </li>
        </ul>
        <ul>
          <li v-for="(v,index) in rightArray" :key="index">
            <div class="img" @click="to_detail(v.id)"
                 :style="{paddingBottom: v.height / v.width * 100 + '%', backgroundImage: 'url('+v.cover+'?x-oss-process=image/resize,w_750)'}"></div>
            <h3 class="one-line-ellipsis">{{v.title}}</h3>
            <p>{{v.dynasty}} | {{v.cate_name}}</p>
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
        cate_name: '',//选中的分类的名称
        cate_id: 0,//选中的分类的id

        leftArray: [],
        rightArray: [],
        left_height: 0,
        right_height: 0,
        page: 0,
        loading: false,
        finished: false,
        count: 0
      };
    },
    mounted() {
      this.getDynastyList();
      this.getCollectCateList();
    },
    methods: {
      // 重置数据的方法
      reset() {
        this.leftArray = [];
        this.rightArray = [];
        this.left_height = 0;
        this.right_height = 0;
        this.page = 0;
        this.loading = false;
        this.finished = false
      },
      onLoad() {
        this.page++;
        this.getCollectList(this.page, () => {
          this.loading = false;
          if ((this.leftArray.length + this.rightArray.length) >= this.count) {
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
          this.getDynastyList(arr => {
            for (let i = 0; i < arr.length; i++) {
              this.columns.push(arr[i].name);
            }
          });
        } else {
          this.columns = ['全部'];
          this.default_index = this.cate_index;
          this.getCollectCateList(arr => {
            for (let i = 0; i < arr.length; i++) {
              this.columns.push(arr[i].cate_name);
            }
          });
        }
      },

      // 选择点击确认后事件
      onConfirm(value, index) {
        this.reset();
        if (this.choise_type === 1) {
          this.choise_dynasty = value === '全部' ? '' : value;
          this.dynasty_index = index;
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

      // 点击前往藏品详情
      to_detail(id) {
        this.$router.push({ name: 'collect-detail', query: { id: id } })
      },

      // 获取藏品数据
      getCollectList(page, callback) {
        let data = {
          dynasty: this.choise_dynasty,
          cate_id: this.cate_id,
          page: page,
          perpage: 10
        };
        // console.log(data);
        this.utils.ajax(this, 'api/collectList', data).then((obj) => {
          this.count = obj.count;
          this.utils.aliyun_format(obj.list, 'cover');
          for (let i = 0; i < obj.list.length; i++) {
            if (this.left_height <= this.right_height) {
              this.leftArray.push(obj.list[i]);
              this.left_height += obj.list[i].height / obj.list[i].width + 0.3599;
            } else {
              this.rightArray.push(obj.list[i]);
              this.right_height += obj.list[i].height / obj.list[i].width + 0.3599;
            }
          }
          // console.log(this.leftArray, 'left');
          // console.log(this.rightArray, 'right');
          // this.rightArray = res.list;
        }).then(() => {
          callback();
        })
      },

      // 获取朝代数据
      getDynastyList(succ) {
        this.utils.ajax(this, 'api/dynastyList').then((arr) => {
          if (succ) {
            succ(arr);
          } else {
            this.dynasty = arr;
          }
        })
      },
      // 获取分类数据
      getCollectCateList(succ) {
        this.utils.ajax(this, 'api/collectCateList').then((arr) => {
          if (succ) {
            succ(arr);
          } else {
            this.cate = arr;
          }
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
      height: 100px;
      background-color: #ffffff;

      .picker-item {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          height: 24px;

          img {
            width: auto;
            height: 100%;
          }
        }

        p {
          font-size: 26px;
          color: #999999;
          margin: 0 8px 0 10px;
        }
      }
    }

    .list-box {
      margin: 10px;
      display: flex;
      justify-content: space-between;

      ul {
        width: calc(50% - 5px);

        li {
          border-radius: 10px;
          overflow: hidden;
          background-color: #ffffff;
          margin-bottom: 10px;
          /*box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);*/

          .img {
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
          }

          h3 {
            font-size: 28px;
            color: #333333;
            margin: 23px 14px;
            font-weight: normal;
          }

          p {
            font-size: 22px;
            color: #999999;
            margin: 0 14px 30px;
          }
        }
      }
    }
  }
</style>

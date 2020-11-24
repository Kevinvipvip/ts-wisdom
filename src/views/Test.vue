<template>
  <div class="test page">
    <ul>
      <li v-for="(item,i) in arr" :key="'item'+i">
        <p>
          <span v-for="(v,k) in item" :key="'v'+k">{{v}}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        arr: [],
        rows: 5
      };
    },
    mounted() {
      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

          console.log(getUserMedia);
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }
      navigator.mediaDevices.getUserMedia().then(res => {
        console.log(res);
      }).catch(err=>{
        console.log(err);
      })


    },
    methods: {
      test() {
        let arr = [];
        for (let i = 0; i <= this.rows; i++) {
          let now_arr = [];
          for (let j = 0; j < this.rows - i; j++) {
            now_arr[j] = '-';
          }
          for (let m = 0; m < 2 * i + 1; m++) {
            now_arr.push('*');
          }
          arr.push(now_arr);
        }
        for (let i = 0; i < this.rows; i++) {
          let now_arr = [];
          for (let j = 0; j <= i; j++) {
            now_arr[j] = '-';
          }
          for (let m = 0; m < 2 * (this.rows - i) - 1; m++) {
            now_arr.push('*');
          }
          arr.push(now_arr);
        }
        console.log(arr);
        this.arr = arr;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .test {

  }
</style>

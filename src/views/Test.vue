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
  };
</script>

<style lang="scss" scoped>
  .test {

  }
</style>

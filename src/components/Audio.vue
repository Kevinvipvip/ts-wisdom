<template>
  <div class="audio">
    <audio :src="url" id="my_audio" controls ref="audio"></audio>
    <div class="my-audio" :style="'background-color: '+bgColor">
      <div class="btn-play" @click="play">
        <div :class="class_name" :style="'border-color: '+color"></div>
      </div>
      <div class="line"><i :style="'width:'+bar_width+'%;background-color:'+color"></i>
        <div class="circle"></div>
      </div>
      <p><span>{{time}}</span> / <span>{{total_time}}</span></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Audio",
    props: {
      url: {
        type: String,
        default: ''
      },
      // 播放器的背景颜色
      bgColor: {
        type: String,
        default: '#ffffff'
      },
      //进度条、播放和暂停的颜色显示
      color: {
        type: String,
        default: '#38c374'
      }
    },
    data() {
      return {
        class_name: 'play',
        total_time: '00:00',//音频总时长
        time: '00:00',//音频播放时长

        time_clock: 0,
        total_s: 0,
        bar_width: 0,//进度条宽度
      }
    },
    methods: {
      play() {
        this.$nextTick(() => {
          let audio = this.$refs.audio;
          let time = Math.floor(audio.duration);
          this.total_s = time;
          this.total_time = this.s_to_hs(time);
          if (audio.paused) {
            audio.play();
            this.class_name = 'pause';
            this.add();
          } else {
            audio.pause();
            this.class_name = 'play';
            window.clearTimeout(this.time_clock);
          }
        });
      },

      add() {
        let audio = this.$refs.audio;
        let current_time = Math.floor(audio.currentTime);
        this.time = this.s_to_hs(current_time);
        this.bar_width = current_time * 100 / this.total_s;
        // console.log(this.bar_width);
        this.time_clock = setTimeout(() => {
          if (current_time >= this.total_s) {
            this.class_name = 'play';
            this.bar_width = 0;
            this.time = '00:00';
            window.clearTimeout(this.time_clock);
          } else {
            this.add();
          }
        }, 1000);
      },

      s_to_hs(s) {
        //计算分钟
        //算法：将秒数除以60，然后下舍入，既得到分钟数
        let min;
        min = Math.floor(s / 60);
        //计算秒
        //算法：取得秒%60的余数，既得到秒数
        s = s % 60;
        //将变量转换为字符串
        min += '';
        s += '';
        //如果只有一位数，前面增加一个0
        // min = (min.length == 1) ? '0' + min : min;
        // s = (s.length == 1) ? '0' + s : s;
        min = min.toString()[1] ? min : '0' + min;
        s = s.toString()[1] ? s : '0' + s;

        return min + ':' + s;
      }
    }
  }
</script>

<style scoped>
  .audio {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .audio audio {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .my-audio {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
    z-index: 22;
  }

  .my-audio .btn-play {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #efefef;
    box-shadow: inset 0 1px 5px 0 rgba(153, 153, 153, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .my-audio .btn-play .play {
    width: 0;
    height: 0;
    margin-left: 4px;
    border-left: 10px solid;
    border-top: 7px solid transparent !important;
    border-bottom: 7px solid transparent !important;
  }

  .my-audio .btn-play .pause {
    width: 4px;
    height: 12px;
    border-left: 2px solid;
    border-right: 2px solid;
  }

  .my-audio .line {
    flex-grow: 1;
    /*width: 55%;*/
    margin: 0 11px;
    background-color: rgb(181, 182, 181);
    height: 2px;
    display: flex;
    align-items: center;
  }

  .my-audio .line i {
    display: block;
    height: 100%;
  }

  .my-audio .line .circle {
    width: 7px;
    height: 7px;
    margin-left: -3.5px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: 0 1px 5px 0 rgba(149, 149, 149, 0.8);
  }

  .my-audio p {
    text-align: right;
    font-size: 14px;
    color: #333333;
  }
</style>

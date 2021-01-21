<template>
  <div class="products page" :style="'background-image: url('+imgs.bg+')'">
    <div class="title products-title"><h1>文创赏析</h1></div>
    <div class="reel-box">
      <div class="reel top" :style="'background-image: url('+imgs.reel_top+')'"></div>
      <div class="reel center" :style="'background-image: url('+imgs.reel_center+')'">

        <ul>
          <li>
            <div class="img-box" :style="'background-image: url('+imgs.bg1+')'">
              <div class="img" :style="'background-image: url('+imgs.img1+')'"></div>
            </div>
            <h3>自由自在丝巾</h3>
            <span>源自吴作人先生的书画作品《自由自在》</span>
            <p :style="'background-image: url('+imgs.border1+')'">尺寸：约170毫米 | 材质：真丝</p>
          </li>

          <li>
            <div class="img-box" :style="'background-image: url('+imgs.bg1+')'">
              <div class="img" :style="'background-image: url('+imgs.img2+')'"></div>
            </div>
            <h3>吉祥物书签</h3>
            <span>以唐山博物馆吉祥物元素为设计灵感</span>
            <p :style="'background-image: url('+imgs.border1+')'">尺寸：约45*55*0.5毫米 | 材质：铜</p>
          </li>

          <li>
            <div class="img-box" :style="'background-image: url('+imgs.bg2+')'">
              <div class="img" :style="'background-image: url('+imgs.img3+')'"></div>
            </div>
            <h3>吉祥物中性笔</h3>
            <span>灵感来源唐博吉祥物元素</span>
            <p :style="'background-image: url('+imgs.border2+')'">尺寸：约130*35*0.5毫米 | 材质：铜</p>
          </li>

          <li>
            <div class="img-box" :style="'background-image: url('+imgs.bg2+')'">
              <div class="img" :style="'background-image: url('+imgs.img4+')'"></div>
            </div>
            <h3>皮影书签</h3>
            <span>灵感来源唐博吉祥物元素</span>
            <p :style="'background-image: url('+imgs.border2+')'">尺寸：约45*55*0.5毫米 | 材质：铜</p>
          </li>

          <li>
            <div class="img-box" :style="'background-image: url('+imgs.bg2+')'">
              <div class="img" :style="'background-image: url('+imgs.img5+')'"></div>
            </div>
            <h3>皮影橡皮擦</h3>
            <span>灵感来源唐博吉祥物元素</span>
            <p :style="'background-image: url('+imgs.border2+')'">尺寸：约50*55*8毫米 | 材质：软胶PVC</p>
          </li>

          <li>
            <div class="img-box" :style="'background-image: url('+imgs.bg2+')'">
              <div class="img" :style="'background-image: url('+imgs.img6+')'"></div>
            </div>
            <h3>皮影钥匙扣</h3>
            <span>灵感来源唐博吉祥物元素</span>
            <p :style="'background-image: url('+imgs.border2+')'">尺寸：约40*40*2毫米 | 材质：合金</p>
          </li>

        </ul>

      </div>
      <div class="reel bottom" :style="'background-image: url('+imgs.reel_bottom+')'"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imgs: {
          bg: this.config.aliyun + 'ts-static/wap/bg-nav.jpg',
          bg1: this.config.aliyun + 'ts-static/wap/product/bg-product1.png',
          bg2: this.config.aliyun + 'ts-static/wap/product/bg-product2.png',
          img1: this.config.aliyun + 'ts-static/wap/product/img-product1.png',
          img2: this.config.aliyun + 'ts-static/wap/product/img-product2.png',
          img3: this.config.aliyun + 'ts-static/wap/product/img-product3.png',
          img4: this.config.aliyun + 'ts-static/wap/product/img-product4.png',
          img5: this.config.aliyun + 'ts-static/wap/product/img-product5.png',
          img6: this.config.aliyun + 'ts-static/wap/product/img-product6.png',
          border1: this.config.aliyun + 'ts-static/wap/product/border1.png',
          border2: this.config.aliyun + 'ts-static/wap/product/border2.png',
          reel_top: this.config.aliyun + 'ts-static/wap/product/reel-top.png',
          reel_center: this.config.aliyun + 'ts-static/wap/product/reel-center.png',
          reel_bottom: this.config.aliyun + 'ts-static/wap/product/reel-bottom.png',
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  .products {
    background-position: top;
    background-size: 100%;
    background-repeat: repeat-y;
    overflow: hidden;

    .products-title {
      background-color: transparent;
      margin: 10px 0 6px;
    }

    .reel-box {
      margin: 0 auto 59px;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: space-between;

      .reel {
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
        width: calc(100% - 72px);
        flex-shrink: 0;

        &.top {
          width: calc(100% - 50px);
          height: 38px;
        }

        &.center {
          height: auto;
          flex-grow: 1;
          background-repeat: repeat-y;
        }

        &.bottom {
          height: 79px;
        }
      }

      ul {
        display: flex;
        margin: 34px 24px;
        padding-bottom: 56px;
        flex-wrap: wrap;
        justify-content: space-between;

        li {
          display: flex;
          flex-flow: column;
          align-items: center;
          width: calc(50% - 16px);
          margin-bottom: 40px;

          &:nth-child(-n+2) {
            width: 100%;

            .img-box {
              padding-bottom: 327px;
            }

            p {
              width: 430px;
              height: 53px;
            }
          }

          .img-box {
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            position: relative;

            .img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: calc(100% - 44px);
              height: calc(100% - 50px);
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
            }
          }

          h3 {
            width: 267px;
            text-align: center;
            border-bottom: 2px solid #87ab8c;
            margin: 31px 0 14px;
            padding-bottom: 10px;
            font-size: 28px;
            color: #cf903a;
            font-weight: normal;
          }

          span {
            color: #cf903a;
            font-size: 24px;
          }

          p {
            width: 293px;
            height: 110px;
            margin: 23px auto 0;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            font-size: 24px;
            color: #999999;
            padding: 0 27px;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            box-sizing: border-box;
          }
        }
      }
    }

  }
</style>

<template>
  <div class="baidu-map page">
    <div class="map-box white">
      <baidu-map class="baidu-map" :zoom="15" :scroll-wheel-zoom="true" :center="location"
                 @ready="map_init"></baidu-map>
    </div>
  </div>
</template>

<script>
  import icon_address from '../assets/icon-map.png'

  export default {
    data() {
      return {
        // 百度地图经纬度坐标
        location: { lng: 118.198793, lat: 39.637367 }
      };
    },
    methods: {
      // 地图初始化
      map_init({ BMap, map }) {
        this.$nextTick(() => {
          // 初始化地图,设置中心点坐标
          var point = new BMap.Point(this.location.lng, this.location.lat);
          map.centerAndZoom(point, 18);

          // 添加鼠标滚动缩放
          map.enableScrollWheelZoom();

          //设置标注的图标
          var icon = new BMap.Icon(icon_address, new BMap.Size(41, 55), { anchor: new BMap.Size(19.5, 55) });
          //设置标注的经纬度
          var marker = new BMap.Marker(new BMap.Point(this.location.lng, this.location.lat), { icon: icon });
          //把标注添加到地图上
          map.addOverlay(marker);
          this.utils.ajax(this, 'api/aboutUs').then(us => {
            var content = "<table>";
            // content = content + "<tr><td> 编号：001</td></tr>";
            content = content + "<tr><td style='text-align: center;font-size:16px;line-height: 25px'>" + us.name + "</td></tr>";
            content = content + "<tr><td style='font-size: 16px;text-align: center'>地址：" + us.address + "</td></tr>";
            content = content + "<tr><td style='text-align: center;font-size: 16px;line-height: 40px;'><a style='background: #cf903a;border-radius:5px;color: #ffffff;padding: 5px 10px;' href='http://api.map.baidu.com/marker?location=" + this.location.lat + "," + this.location.lng + "&title=" + us.name + "&content=" + us.address + "&output=html&src=webapp.baidu.openAPIdemo'>到这去</a></td></tr>";
            content += "</table>";
            var infowindow = new BMap.InfoWindow(content);
            // 图标点击的时候显示标注
            marker.addEventListener("click", function () {
              this.openInfoWindow(infowindow);
            });
          });

          // 标注默认显示
          // var infoWindow = new BMap.InfoWindow(content) // 创建信息窗口对象
          // map.openInfoWindow(infoWindow, point)
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .baidu-map {
    .map-box {
      width: 100%;
      height: calc(100vh - 390px - 88px);

      .baidu-map {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

import config from './config';
import qs from 'qs';

const date_format = (date, fmt = 'yyyy.MM.dd') => {
  if (date) {
    // 如果是数字类型
    if (typeof date === 'number') {
      date = date.toString()[12] ? new Date(date) : new Date(date * 1000);
    }
    var weekday = new Array(7);
    weekday[0] = "日";
    weekday[1] = "一";
    weekday[2] = "二";
    weekday[3] = "三";
    weekday[4] = "四";
    weekday[5] = "五";
    weekday[6] = "六";
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      'w+': weekday[date.getDay()],//周几
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  } else {
    return '';
  }
};

const ajax = (vue, url, data, handle_code_list = []) => {
  data = data || {};
  let token = localStorage.getItem('token') || '';
  if (data instanceof FormData) {
    data.append('token', token);
  } else {
    data.token = token;
  }

  return new Promise((resolve, reject) => {
    vue.$axios({
      method: 'post',
      url: config.api + url,
      data: data instanceof FormData ? data : qs.stringify(data),  // 如果是FormData类型则为上传文件，data原样上传
      timeout: 5000  // 请求超时时间
    }).then(res => {
      if (res.data.code === 1) {
        resolve(res.data.data)  // 接口正确则直接返回数据
      } else {
        // 如果错误码在自行处理的列表里，则reject回去
        if (handle_code_list.indexOf(res.data.code) !== -1) {
          reject(res.data)
        } else {
          switch (res.data.code) {
            case -3:  // token无效
            case -5:  // token未传
            case -6:  // token未传
              // 重新跳转授权
              vue.$dialog.alert({
                message: '登录已失效',
              }).then(() => {
                localStorage.clear();
                vue.$router.push({
                  path: '/login',
                  query: {
                    url: vue.$route.path,
                    params: vue.$route.query
                  }
                });
              });
              break;
            case 66:
              vue.$dialog.alert({
                message: res.data.data,
                confirmButtonColor: '#cf903a',
              }).then(() => {
                vue.$router.replace({ name: 'activity' });
              });
              break;
            case 67:
              vue.$dialog.alert({
                message: res.data.data,
                confirmButtonColor: '#cf903a',
              }).then(() => {
                vue.$router.replace({ name: 'mine', query: { on: 2 } });
              });
              break;
            case 58:
              vue.$toast(res.data.message);
              break;
            default:
              vue.$toast(res.data.data);
              break;
          }
        }
      }
    }).catch(() => {
      vue.$toast('网络超时');
    })
  })
};
// 处理阿里云图片路径
const aliyun_format = (obj, aliyun_field = 'pic') => {
  if (obj instanceof Array) {
    if (typeof obj[0] === 'string') {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = aliyun_empty_or(obj[i]);
      }
    } else {
      for (let i = 0; i < obj.length; i++) {
        obj[i][aliyun_field] = aliyun_empty_or(obj[i][aliyun_field]);
      }
    }
  } else if (typeof obj === 'object') {
    obj[aliyun_field] = aliyun_empty_or(obj[aliyun_field]);
  } else {
    return aliyun_empty_or(obj);
  }
};
const aliyun_empty_or = (aliyun) => {
  if (aliyun) {
    if (aliyun.indexOf('https') === 0) {
      return aliyun;
    } else {
      return config.aliyun + aliyun;
    }
  }
};
const format_img = (obj, img_field = 'pic') => {
  if (obj instanceof Array) {
    if (typeof obj[0] === 'string') {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = empty_or(obj[i]);
      }
    } else {
      for (let i = 0; i < obj.length; i++) {
        obj[i][img_field] = empty_or(obj[i][img_field]);
      }
    }
  } else if (typeof obj === 'object') {
    obj[img_field] = empty_or(obj[img_field]);
  } else {
    return empty_or(obj);
  }
};
const empty_or = (img) => {
  if (img) {
    if (img.indexOf('https') === 0) {
      return img;
    } else {
      return config.url + img;
    }
  }
};

const get_status = (refund, check, expire, return_data = 'tip') => {
  let status, img, data, type, color;
  if (expire !== 0) {
    switch (expire) {
      case 1:
        status = '部分过期';
        type = 2;
        img = config.aliyun + '/ts-static/wap/ticket-expired-part.png';
        color = '#cf903a';
        break;
      case 2:
        status = '已过期';
        type = 2;
        img = config.aliyun + '/ts-static/wap/ticket-expired.png';
        color = '#999999';
        break;
    }
  } else {
    if (check !== 0) {
      switch (check) {
        case 1:
          status = '部分核销';
          type = 1;
          img = config.aliyun + '/ts-static/wap/ticket-hexiao-part.png';
          color = '#cf903a';
          break;
        case 2:
          status = '已核销';
          type = 2;
          img = config.aliyun + '/ts-static/wap/ticket-hexiao.png';
          color = '#999999';
          break;
      }
    } else {
      if (refund !== 0) {
        switch (refund) {
          case 1:
            status = '部分退票';
            type = 1;
            img = config.aliyun + '/ts-static/wap/ticket-refund-part.png';
            color = '#cf903a';
            break;
          case 2:
            status = '已退票';
            type = 2;
            img = config.aliyun + '/ts-static/wap/ticket-refund.png';
            color = '#999999';
            break;
        }
      } else {
        status = '待检票';
        type = 1;
        img = config.aliyun + '/ts-static/wap/ticket-succ.png';
        color = '#29ac83';
      }
    }
  }
  switch (return_data) {
    case 'tip':
      data = status;
      break;
    case 'img':
      data = img;
      break;
    case 'type':
      data = type;
      break;
    case 'color':
      data = color;
      break;
  }
  return data;
};

const jump = (vue, url) => {
  let page = url.split('?');
  if (url) {
    if (url.indexOf('http') !== -1) {
      location.href = url;
    } else {
      if (page[1]) {
        let arr_query = page[1].split('&'), query = {};
        for (let i = 0; i < arr_query.length; i++) {
          let qurey_item = arr_query[i].split("=");
          query[qurey_item[0]] = qurey_item[1];
        }
        vue.$router.push({ path: '/' + page[0], query: query });
      } else {
        vue.$router.push({ path: '/' + page[0] });
      }
    }
  }
};

// 将秒转换成时分秒
const secondsFormat = (s) => {
  var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
  var hour = Math.floor((s - day * 24 * 3600) / 3600);
  var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
  var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
  return day + "天" + hour + "时" + minute + "分" + second + "秒";
};
const s_to_hs = (s) => {
  //将秒转换成时分秒
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  let hous, min;
  min = Math.floor(s / 60);
  hous = Math.floor(min / 60);
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  min = min % 60;
  s = s % 60;
  //将变量转换为字符串
  min += '';
  s += '';
  //如果只有一位数，前面增加一个0
  min = (min.length == 1) ? '0' + min : min;
  s = (s.length == 1) ? '0' + s : s;
  return hous + ':' + min + ':' + s;
};

// 跳转微信授权，获取code
function auth(routePath) {
  let appid = config.appid;
  let redirectUri = encodeURIComponent(config.vue_base + routePath);
  location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
}

// 获取url参数对象（目前只在登录判断中用到）
function get_params() {
  let url = location.search;
  let params = {};
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1);
    let strs = str.split('&');
    for (var i = 0; i < strs.length; i++) {
      let kv = strs[i].split('=');// key 和 value
      params[kv[0]] = unescape(kv[1]);
    }
  }
  return params
}
// 获取最小值数组索引值
const getMinIndex = (arr) => {
  let min = arr[0].list_height;
  //声明了个变量 保存下标值
  let index = 0;
  for (var i = 0; i < arr.length; i++) {
    if (min > arr[i].list_height) {
      min = arr[i].list_height;
      index = i;
    }
  }
  return index;
};
export default {
  auth,
  get_params,
  date_format,    //格式化时间
  ajax,           //请求后台数据
  format_img,     //补全图片路径
  aliyun_format,  //补全阿里云图片路径
  get_status,  //检测订单状态
  jump,  //公共跳页方法
  secondsFormat,  //将秒转换成日时分秒
  getMinIndex,//获取最小值数组索引值
  s_to_hs,  //将秒转换成时分秒
}

// https請求封裝
const https = require('https')
module.exports.getHttps = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, function (respObj) {
      let allData = ''
      respObj.on('data', function (chunk) {
        allData += chunk;
      })
      respObj.on('end', function () {
        resolve(JSON.parse(allData));
      })
    })
  })
}

// 将对象拆为用&和=连接的字符串
module.exports.joinParams = (data) => {
  let paramsArr = []
  for (let key in data) {
    paramsArr.push(key + '=' + data[key])
  }
  return paramsArr.join('&')
}

// 获取当前时间
module.exports.getTimeNum = () => {
  var _date = new Date(); //时间对象
  var y = _date.getFullYear();
  var m = add0(_date.getMonth() + 1);
  var d = add0(_date.getDate());
  var h = add0(_date.getHours());
  var i = add0(_date.getMinutes());
  var s = add0(_date.getSeconds());
  var No = '' + y + m + d + h + i + s;
  return No;
}
function add0 (num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

// 判断是否存在
module.exports.isExsist = (mes, resp, arr, callBack) => {
  let _callBack = callBack
  console.log('path:', mes.path)
  console.log('query:', mes.query) // 若是post请求，则用body
  let flag = true
  if (arr != []) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == null || arr[i] == undefined || arr[i] == 'null' || arr[i] == 'undefined') {
        flag = false
      }
    }
  }
  if (flag) {
    _callBack()
  } else {
    resp.json({
      code: 404,
      errMsg: '参数错误'
    })
  }
}

/*** emoji表情替换
*
*@param source 原字符串
*@param slipStr emoji表情替换成的字符串
*/
module.exports.isExsistfilterEmoji = (source, slipStr = '') => {
  if (source && source != '' && source != 'null' && source != 'undefined') {
    let reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
    let afterS = source.replace(reg, '')
    return (afterS == ' ' || afterS == '') ? 'emo' : afterS
  } else {
    return source
  }
}


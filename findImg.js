const fs = require('fs');
var getPixelsFn = require("./lib/GetPixelsFn");

function indexOfAll (str, str2) {
  let arr = [];
  let index = str.indexOf(str2, 0);

  let i = 1;
  while (i < str.length && index > -1) {
    i++;
    arr.push(index);
    index = str.indexOf(str2, index + 1);
  }
  return arr;
}

async function getData () {
  let data1 = await getPixelsFn(__dirname + '/imgs/testBuffer.png');
  let data2 = await getPixelsFn(__dirname + '/imgs/testBuffer2.png');

  let testBuffer = null;
  let testBuffer2 = null;

  // console.log(data1);
  // console.log(data2);

  // 删除透明度
  ((arr) => {
    for (let i = 0; i < arr.length; i++) {
      let _arr = arr[i];
      for (let j = 0; j < _arr.length; j++) {
        if (_arr[j] !== '') {
          _arr[j] = _arr[j].replace(/,[0-9.]+$/, '');
        }
      }
      arr[i] = arr[i].join('-');
    }
    // fs.writeFileSync('./testBuffer.js', 'module.exports = ' + JSON.stringify(arr, null, 2));
    testBuffer = arr;
  })(data1.arr);

  // 删除透明度
  ((arr) => {
    // 删除透明度
    for (let i = 0; i < arr.length; i++) {
      let _arr = arr[i];
      for (let j = 0; j < _arr.length; j++) {
        if (_arr[j] !== '') {
          _arr[j] = _arr[j].replace(/,[0-9.]+$/, '');
        }
      }
      arr[i] = arr[i].join('-');
    }
    // fs.writeFileSync('./testBuffer2.js', 'module.exports = ' + JSON.stringify(arr, null, 2));
    testBuffer2 = arr;
  })(data2.arr);

  // let testBuffer = require('./testBuffer');
  // let testBuffer2 = require('./testBuffer2');
  // 大图片
  let maxImg = data1.width > data2.width ? data1 : data2;
  let testArr = data1.width > data2.width ? testBuffer : testBuffer2;
  // 小图片
  let minImg = data1.width > data2.width ? data2 : data1;
  let testArr2 = data1.width > data2.width ? testBuffer2 : testBuffer;

  // 查找小图片 Y = 0 在 大图片出现位置
  let inAllArr = [];
  let checkInAllArr = [];
  for (let i = 0; i < testArr.length; i++) {
    const str = testArr[i];
    let inArr = indexOfAll(str, testArr2[0]);
    if (inArr.length) {
      inAllArr.push({
        arrY: i,
        inArr: inArr
      });
    }
  }

  // for (let i = 0; i < inAllArr.length; i++) {
  for (let i = 0; i < inAllArr.length; i++) {
    let Y = inAllArr[i].arrY;
    let arr = inAllArr[i].inArr;
    if (!arr.length) {
      continue;
    }
    for (let k = 0; k < arr.length; k++) {
      for (let j = 0; j < testArr2.length; j++) {
        const srt = testArr2[j];
        if (testArr[Y + j] && arr[k] !== void(0)) {
          let index = testArr[Y + j].indexOf(srt, arr[k]);
          if (index === -1) {
            arr[k] = void(0);
            break;
          }
        } else {
          break;
        }
      }
      if (arr[k] !== void(0)) {
        inAllArr[i].arrX = inAllArr[i].arrX || [];
        let inTestArrStr = testArr[Y].substring(0, arr[k]);
        if (inTestArrStr.length) {
          let rgbArr = inTestArrStr.split('-');
          if (/-$/g.test(inTestArrStr)) {
            inAllArr[i].arrX.push(rgbArr.length - 1);
          } else {
            inAllArr[i].arrX.push(rgbArr.length);
          }
        } else {
          inAllArr[i].arrX.push(0);
        }
      }
    }
    if (arr.join('') === '') {
      inAllArr[i] = null;
    } else {
      // 删除字段
      delete inAllArr[i].inArr;
      checkInAllArr.push(inAllArr[i]);
    }
  }
  return {
      checkData: checkInAllArr,
      maxImg: {
        width: maxImg.width,
        height: maxImg.height
      },
      minImg: {
        width: minImg.width,
        height: minImg.height
      }
  };
}

async function init () {
  let res = await getData();

  console.log(JSON.stringify(res, null, 2));
  // fs.writeFileSync('./log.js', 'module.exports = ' + JSON.stringify(res, null, 2));
  return res;
}
init();


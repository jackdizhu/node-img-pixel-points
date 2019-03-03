const fs = require('fs');

let imgData = fs.readFileSync('./imgData.js');
let arr = JSON.parse(imgData);

// 计算灰度值
function getGray(R, G, B, A) {
  let Gray = (R * 30 + G * 59 + B * 11 + 50) / 100
  return Gray;
}

// 根据灰度生成相应字符
function toText(g) {
  if (g <= 30) {
    return "8";
  } else if (g > 30 && g <= 60) {
    return "&";
  } else if (g > 60 && g <= 120) {
    return "$";
  } else if (g > 120 && g <= 150) {
    return "*";
  } else if (g > 150 && g <= 180) {
    return "o";
  } else if (g > 180 && g <= 210) {
    return "!";
  } else if (g > 210 && g <= 240) {
    return ";";
  } else {
    return ".";
  }
}

function init(arr) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    const _arr = arr[i];
    for (let j = 0; j < _arr.length; j++) {
      const _str = _arr[j];
      if (_str) {
        let _arr = _str.split(',');
        str += toText(getGray(..._arr));
      } else {
        str += ' ';
      }
    }
    str += '\n';
  }
  return str;
}

console.log(init(arr));

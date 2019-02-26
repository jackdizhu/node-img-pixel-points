const fs = require('fs');
const { createCanvas } = require('canvas');
const images = require("images");

// 测试 小图片 像素点
function test() {
  let { width, height } = { width: 50, height: 50 };
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // fillStyle // 设置图形的填充颜色。
  // strokeStyle // 设置图形轮廓的颜色。

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "#ff0000";
  // 起始点不包含
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "#ff0000";
  // 起始点不包含
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "#000000";
  // 起始点不包含
  ctx.moveTo(0, 0);
  ctx.lineTo(height, height);
  ctx.stroke();

  const out = fs.createWriteStream(__dirname + '/imgs/testStream.png');
  const stream = canvas.createPNGStream(); // createJPEGStream()
  stream.pipe(out);
  out.on('finish', () =>  console.log('Stream 图片保存成功'));

  const buf = canvas.toBuffer();
  fs.writeFile(__dirname + '/imgs/testBuffer.png', buf, (err) => {
    if (err) {
      console.log(err);
      return false;
    }
    console.log('Buffer 图片保存成功');

    // 图片裁剪
    let img = images(__dirname + '/imgs/testBuffer.png');
    images(img, 0, 20, 30, 30).save(__dirname + '/imgs/testBuffer2.png');
  })

  let imgData = ctx.getImageData(0, 0, width, height).data;
  let arr = [];
  let arrY = 0;
  let arrN = 0;
  for (let i = 0; i < imgData.length; i += 4) {
    arr[arrY] = arr[arrY] || [];
    let R = imgData[i + 0];
    let G = imgData[i + 1];
    let B = imgData[i + 2];
    let A = imgData[i + 3];

    // 计算透明度
    str = `${R},${G},${B},${(A / 255).toFixed(1)}`;
    // 去除空像素点
    // str = str === '0,0,0,0.0' ? '' : rgbToHex(R, G, B, A);
    str = str === '0,0,0,0.0' ? '' : str;
    arr[arrY].push(str);

    arrN += 1;
    arrN = arrN % width;
    if (arrN === 0) {
      arrY += 1;
    }
  }
  console.log({ width, height });
  fs.writeFileSync('./imgData.js', JSON.stringify(arr, null, 2));
}

// init
test();
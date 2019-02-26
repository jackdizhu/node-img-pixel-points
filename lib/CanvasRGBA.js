const { createCanvas, loadImage } = require('canvas');

// RGB 转 16进制颜色
function rgbToHex(r, g, b, a) {
  let R = Number(r).toString(16);
  R = R.length === 1 ? '0' + R : R;
  let G = Number(g).toString(16);
  G = G.length === 1 ? '0' + G : G;
  let B = Number(b).toString(16);
  B = B.length === 1 ? '0' + B : B;
  let A = Number(a).toString(16);
  A = A.length === 1 ? '0' + A : A;
  return '' + R + G + B + A;
}

// 获取图片 像素点RGBA
function getRGBA(url) {
  return new Promise((res, rej) => {
    loadImage(url).then((image) => {
      let { width, height } = image;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, width, height);
  
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
      res({arr, width, height});
    })
  });
}

module.exports = getRGBA;
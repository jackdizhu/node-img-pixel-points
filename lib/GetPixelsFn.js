var getPixels = require("get-pixels")

// RGB 转 16进制颜色
function rgbToHex(r, g, b, a) {
  let R = Number(r);
  R = R < 10 ? '0' + R : R.toString(16);
  let G = Number(g);
  G = G < 10 ? '0' + G : G.toString(16);
  let B = Number(b);
  B = B < 10 ? '0' + B : B.toString(16);
  let A = Number(a);
  A = A < 10 ? '0' + A : A.toString(16);
  return R + G + B + A;
}
function getPixelsFn (url) {
  return new Promise((res, rej) => {
    getPixels(url, function(err, pixels) {
      if (err) {
        rej(err);
        return
      }
      let [width, height] = pixels.shape;
      let imgData = [...pixels.data];
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
      // console.log({ width, height });
      // fs.writeFileSync('./log.txt', JSON.stringify(pixels));
      // fs.writeFileSync('./imgData.js', JSON.stringify(arr, null, 2));
      res({arr, width, height});
      return false;
    })
  });
}

module.exports = getPixelsFn;
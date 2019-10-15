/**
 * 图片与屏幕大小适应处理
 * @param {Number} naturalW 图片实际宽度
 * @param {Number} naturalH 图片实际高度
 * @param {Number} screenW 屏幕宽度
 * @param {Number} screenH 屏幕高度
 */
export function sizeScale (naturalW, naturalH, screenW, screenH) {
  let scale = 1;

  // 图片缩放处理
  if (naturalW > screenW && naturalH < screenH) {
    scale = screenW / naturalW;
  } else if (naturalH > screenH && naturalW < screenW) {
    scale = screenH / naturalH;
  } else {
    scale = Math.min(screenW / naturalW, screenH / naturalH);
  }

  let renderW = naturalW * scale;
  let renderH = naturalH * scale;

  // 将图片移至屏幕中间
  let dx = (screenW - renderW) / 2;
  let dy = (screenH - renderH) / 2;

  return {
    left: dx,
    top: dy,
    width: renderW,
    height: renderH
  }
}

export function checkBorderAndCenterWhenScale (deltaX, deltaY, ratioX, ratioY) {
  let pos = {
    left: ratioX,
    top: ratioY
  };

  // 图片宽度比屏幕宽，left 不能大于0，否则会有空白
  if (deltaX > 0) {
    if (ratioX > 0) {
      pos.left = 0;
    } else if (ratioX < 0) {
      if (ratioX < deltaX / 2) {
        pos.left = deltaX / 2;
      }
    }
  }
  if (deltaY > 0) {
    if (ratioY > 0) {
      pos.top = 0;
    } else if (ratioY < 0) {
      if (ratioY < deltaY / 2) {
        pos.top = deltaY / 2;
      }
    }
  }

  return pos;
}

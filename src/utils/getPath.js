import { CONSTANT } from '../utils/constant';

/**
 * @method getImgUrl
 * @param { String } webUrl 图片在 web 端相队 assets/images/ 下的路径，android, ios 固定
 * @return { String } 获取图片在各端存储路径
 * 本地图片引入路径示例可参照 myDisk/index.vue 文件
 * android 端 /platforms/android/app/src/main/res/drawable-xxhdpi
 * 不要去自定义一个子目录，不支持，必须写在 android 已有路径下
 * ios 放入xcode 底下的 /Source/images/下
 * weexplayground 环境下，debugMode 为 true
 */

export function getImgUrl (webUrl) {
  // 获取图片在三端上不同的路径
  let imgName = webUrl.split('/').pop();
  let relativePath = webUrl.substring(0, webUrl.length - imgName.length);
  let pureName = imgName.split('.')[0];
  let suffixName = imgName.split('.')[1];
  
  // 如果没写文件后缀名，就默认是 png
  if (!suffixName) {
    suffixName = '.' + 'png';
  } else {
    suffixName = '.' + suffixName;
  }
  const CUR_RUN_PLATFORM = weex.config.env.platform;
  const WEB_IMAGE_URL = `src/assets/images/${relativePath}${pureName}${suffixName}`;
  if (weex.config.env.debugMode) {
    return `${CONSTANT.LOCAL_URL}/${WEB_IMAGE_URL}`;
  } else {
    const ICON_URL = {
      Web: `${WEB_IMAGE_URL}`,
      android: `local:///${pureName}`,
      iOS: `local:///filePng/${pureName}${suffixName}`
    }
    return ICON_URL[CUR_RUN_PLATFORM];
  }
}

/**
 * 初始化 iconfont 路径
 * @method initIconfont
 * @param {String} icPath inconfont 文件相对各端的存储路径
 * @example
 * const ICONFONT_URL = {
 *    Web: `src/assets/images/${ICONFONT_NAME}`,
 *    android: `local:///${ICONFONT_NAME}`,
 *    iOS: `./font/${ICONFONT_NAME}`,
 *    others: `//at.alicdn.com/t/font_1274721_la2cu4arz7.ttf`
 *  }
 * Web     : 保持传入的相对 src 的存储路径
 * Android : 'local:///iconfont'  'local:///' 代表 assets 目录，如 `local:///${ICONFONT_NAME}` 表示文件放在 assets 根目录下。（要在 as 中测试）
 * iOS     : './' 打包后的相对 js 文件路径，如 `./font/${ICONFONT_NAME}`，表示打包后和 js 同一目录下的子文件夹 font 目录下
 * weexplayground 环境下，无法通过 platform 判断，用 debugMode 为 true判断
 */
export function initIconfont (icPath) {
  // 获取图片在三端上不同的路径
  const CUR_RUN_PLATFORM = weex.config.env.platform;
  const IS_WXP = weex.config.env.debugMode;
  let url;
  if (IS_WXP) {
    url = `${CONSTANT.LOCAL_URL}/${icPath.Web}`;
  } else {
    url = icPath[CUR_RUN_PLATFORM];
    if (url === '') {
      url = icPath.others;
    }
  }

  const domModule = weex.requireModule('dom')

  domModule.addRule('fontFace', {
    'fontFamily': 'iconfontListenDisk',
    'src': `url('${url}')`
  });
  console.log('当前环境运行平台是 wxp：', Boolean(IS_WXP));
  console.log('当前环境运行平台是：', CUR_RUN_PLATFORM);
  console.log('当前 iconfont 路径：', url);
}

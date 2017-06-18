const userAgent = navigator.userAgent;

const isWindowsPhone = userAgent.indexOf('Windows Phone') >= 0;
const isAndroid = userAgent.indexOf('Android') > 0 && !isWindowsPhone;

export default {
  isWindowsPhone,
  isAndroid,
};

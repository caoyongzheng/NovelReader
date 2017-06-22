export default (str) => {
  if (!str) return null;
  const t = new Date(str).getTime();
  const now = Date.now();
  let d = ((now - t) / 1000).toFixed();
  if (d < 60) {
    return `${d}秒`;
  }
  d = (d / 60).toFixed();
  if (d < 60) {
    return `${d}分`;
  }
  d = (d / 60).toFixed();
  if (d < 24) {
    return `${d}小时`;
  }
  d = (d / 24).toFixed();
  if (d < 30) {
    return `${d}天`;
  }
  d = (d / 30).toFixed();
  if (d < 12) {
    return `${d}月`;
  }
  d = (d / 12).toFixed();
  if (d < 10) {
    return `${d}年`;
  }
  return '很久以前';
};

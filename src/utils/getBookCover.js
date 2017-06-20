export default function getBookCover(cover) {
  if (cover.startsWith('/agent/')) {
    return cover.substring(7);
  }
  if (cover.startsWith('/cover/')) {
    return `http://statics.zhuishushenqi.com${cover}`;
  }
  return cover;
}

export default (wordCount = 0) => {
  if (wordCount < 10000) {
    return `${wordCount}字`;
  }
  return `${Math.floor(wordCount / 10000)}万字`;
};

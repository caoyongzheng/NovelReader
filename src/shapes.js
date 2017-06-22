import PropTypes from 'prop-types';

const Book = PropTypes.shape({
  _id: PropTypes.string,
  author: PropTypes.string,
  shortIntro: PropTypes.string,
  title: PropTypes.string,
  site: PropTypes.string,
  majorCate: PropTypes.string,
  latelyFollower: PropTypes.number,
  retentionRatio: PropTypes.number,
  lastChapter: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
});

const History = PropTypes.shape({
  goBack: PropTypes.func,
  push: PropTypes.func,
  replace: PropTypes.func,
  action: PropTypes.string,
  location: PropTypes.object,
});

export default {
  Book,
  History,
};

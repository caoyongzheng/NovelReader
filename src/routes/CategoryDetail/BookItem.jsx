import React from 'react';
import PropTypes from 'prop-types';
import cn from './BookItem.less';
import getBookCover from '../../utils/getBookCover';
import Tappable from '../../components/Tappable';

function formatFollower(latelyFollower) {
  if (latelyFollower < 10000) return latelyFollower;
  return `${(latelyFollower / 10000).toFixed(1)}万`;
}

class BookItem extends React.PureComponent {
  render() {
    const {
      cover, title, author, majorCate, shortIntro, latelyFollower,
      retentionRatio, push, id,
    } = this.props;
    return (
      <Tappable onTap={() => push(`/book/${id}`)}>
        <div className={cn.container}>
          <img className={cn.img} src={getBookCover(cover)} alt="书籍封面" />
          <div className={cn.bookInfo}>
            <div className={cn.title}>{title}</div>
            <div className={cn.author}>
              {author}
              <span className={cn.split}>{'|'}</span>
              {majorCate}
            </div>
            <div className={cn.shortIntro}>{shortIntro}</div>
            <div className={cn.statistics}>
              <span className={cn.data}>{formatFollower(latelyFollower)}</span>
              {'人气'}
              <span className={cn.split}>{'|'}</span>
              <span className={cn.data}>{`${retentionRatio}%`}</span>
              {'读者存留'}
            </div>
          </div>
        </div>
      </Tappable>
    );
  }
}

BookItem.defaultProps = {
  cover: '',
  majorCate: '',
  shortIntro: '',
  latelyFollower: 0,
  retentionRatio: 0.00,
};

BookItem.propTypes = {
  id: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
  cover: PropTypes.string,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  majorCate: PropTypes.string,
  shortIntro: PropTypes.string,
  latelyFollower: PropTypes.number,
  retentionRatio: PropTypes.number,
};

export default BookItem;

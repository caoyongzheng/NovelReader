import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cn from './index.less';
import handleReject from '../../utils/handleReject';
import fromDow from '../../utils/fromDow';
import ScrollView from '../../components/ScrollView';
import getBookCover from '../../utils/getBookCover';
import formatWordCount from '../../utils/formatWordCount';

class Book extends React.PureComponent {
  state = {
    book: {},
    loading: false,
  }
  componentWillMount() {
    this.getBook(this.props.id);
  }
  getBook = (id) => {
    const url = `http://api.zhuishushenqi.com/book/${id}`;
    return fetch(`${process.env.PROXY_API}?url=${url}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then((data) => {
      this.setState({ book: { ...this.state.book, ...data } });
    }).catch(handleReject);
  }
  render() {
    const { book } = this.state;
    return (
      <div className={cn.container}>
        <ScrollView>
          <div className={cn.book}>
            {React.createElement(
              book.cover ? 'img' : 'span',
              {
                alt: '封面',
                className: cn.cover,
                src: getBookCover(book.cover),
              },
            )}
            <div
              className={cn.right}
              style={{ margin: '10px 14px 10px 0px' }}
            >
              <div className={cn.title}>
                {get(book, ['title'], '')}
              </div>
              <div className={cn.author}>
                {get(book, ['author'], '')}
              </div>
              <div className={cn.info}>
                {fromDow(get(book, ['updated']))}{'前更新'}
                <span className={cn.split}>{'|'}</span>
                {formatWordCount(get(book, ['wordCount']))}
                <span className={cn.split}>{'|'}</span>
                {get(book, ['cat'])}
              </div>
            </div>
          </div>
        </ScrollView>
      </div>
    );
  }
}

Book.defaultProps = {};

Book.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Book;

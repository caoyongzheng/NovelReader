import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cn from './index.less';
import Tappable from '../../components/Tappable';
import handleReject from '../../utils/handleReject';
import fromDow from '../../utils/fromDow';
import ScrollView from '../../components/ScrollView';
import getBookCover from '../../utils/getBookCover';
import formatWordCount from '../../utils/formatWordCount';
import shapes from '../../shapes';

const TagColors = ['#F44336', '#3F51B5', '#009688', '#FFEB3B', '#795548'];

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
  handleRead = () => {
    const { history, id } = this.props;
    history.push(`/reader/${id}`);
  }
  render() {
    const { book } = this.state;
    const tags = get(book, ['tags'], []);
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
          <div className={cn.action}>
            <div className={cn.item}>
              <div className="btn-primary">{'追更新'}</div>
            </div>
            <Tappable
              onTap={this.handleRead}
            >
              <div className={cn.item}>
                <div className="btn-primary">{'开始阅读'}</div>
              </div>
            </Tappable>
          </div>

          <div className={cn.statistics}>
            <div className={cn.flex}>
              <div className={cn.name}>{'追书人气'}</div>
              <div className={cn.value}>{get(book, ['latelyFollower'], 0)}</div>
            </div>
            <div className={cn.flex}>
              <div className={cn.name}>{'读者存留率'}</div>
              <div className={cn.value}>{get(book, ['retentionRatio'], '0.0')}{'%'}</div>
            </div>
            <div className={cn.flex}>
              <div className={cn.name}>{'日更新字数'}</div>
              <div className={cn.value}>{get(book, ['serializeWordCount'], 0)}</div>
            </div>
          </div>
          {
            tags.length > 0 ? (
              <div className={cn.tags}>
                {tags.map((t, i) => (
                  <span
                    key={t}
                    style={{
                      backgroundColor: TagColors[i % TagColors.length],
                    }}
                    className={cn.tag}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null
          }

          <pre className={cn.longIntro}>
            {get(book, ['longIntro'], '')}
          </pre>
        </ScrollView>
      </div>
    );
  }
}

Book.defaultProps = {};

Book.propTypes = {
  id: PropTypes.string.isRequired,
  history: shapes.History.isRequired,
};

export default Book;

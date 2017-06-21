import React from 'react';
import PropTypes from 'prop-types';
import cn from './BookList.less';
import BookItem from './BookItem';
import shapes from '../../shapes';
import ScrollView from '../../components/ScrollView';

class BookList extends React.PureComponent {
  render() {
    const {
      id: k, list, hide, loading,
      requestLoading, onScrollBottom, getting,
    } = this.props;
    return (
      <ScrollView
        hide={hide}
        loading={loading}
        requestLoading={() => requestLoading(k)}
        onScrollBottom={() => onScrollBottom(k)}
      >
        {list.map(({ _id: id, ...others }) => (
          <BookItem key={id} id={id} {...others} />
        ))}
        {getting ? (
          <div className={cn.loading}>{'加载中...'}</div>
        ) : null}
      </ScrollView>
    );
  }
}

BookList.defaultProps = {};

BookList.propTypes = {
  id: PropTypes.string.isRequired,
  hide: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  getting: PropTypes.bool.isRequired,
  requestLoading: PropTypes.func.isRequired,
  onScrollBottom: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(shapes.Book).isRequired,
};

export default BookList;

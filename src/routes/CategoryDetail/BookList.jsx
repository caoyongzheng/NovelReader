import React from 'react';
import PropTypes from 'prop-types';
import BookItem from './BookItem';
import shapes from '../../shapes';

class BookList extends React.PureComponent {
  render() {
    const { list } = this.props;
    return (
      <div>
        {list.map(({ _id: id, ...others }) => (
          <BookItem key={id} id={id} {...others} />
        ))}
      </div>
    );
  }
}

BookList.defaultProps = {};

BookList.propTypes = {
  list: PropTypes.arrayOf(shapes.Book).isRequired,
};

export default BookList;

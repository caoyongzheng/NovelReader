import React from 'react';
import PropTypes from 'prop-types';
import cn from './ChapterReader.less';

class ChapterReader extends React.PureComponent {
  state = {}
  render() {
    const { title, content } = this.props.chapter;
    return (
      <div className={cn.container}>
        {title}
        <pre>
          {content}
        </pre>
      </div>
    );
  }
}

ChapterReader.defaultProps = {
  chapter: {
    title: '',
    content: '',
  },
};

ChapterReader.propTypes = {
  chapter: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default ChapterReader;

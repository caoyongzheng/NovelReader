import React from 'react';
import PropTypes from 'prop-types';
import cn from './ChapterList.less';


class ChapterList extends React.PureComponent {
  state = {}
  render() {
    const { chapters } = this.props;
    return (
      <div className={cn.container}>
        {chapters.map(({ title, link }) => (
          <div key={link}>{title}</div>
        ))}
      </div>
    );
  }
}

ChapterList.defaultProps = {
  chapters: [],
};

ChapterList.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  })),
};

export default ChapterList;

import React from 'react';
import PropTypes from 'prop-types';
import cn from './ChapterList.less';
import Tappable from '../../components/Tappable';

class ChapterList extends React.PureComponent {
  state = {}
  render() {
    const { chapters, requestClose } = this.props;
    return (
      <div className={cn.container}>
        <div className={cn.list}>
          {chapters.map(({ title, link }) => (
            <div className={cn.item} key={link}>{title}</div>
          ))}
        </div>
        <Tappable onTap={requestClose}>
          <div className={cn.footer}>{'关闭'}</div>
        </Tappable>
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
  requestClose: PropTypes.func.isRequired,
};

export default ChapterList;

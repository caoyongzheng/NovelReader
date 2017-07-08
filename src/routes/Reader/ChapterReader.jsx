import React from 'react';
import PropTypes from 'prop-types';
import cn from './ChapterReader.less';
import Tappable from '../../components/Tappable';

class ChapterReader extends React.PureComponent {
  state = {}
  handleTap = (e) => {
    const y = e.clientY;
    const totolY = window.innerHeight;
    if (y < totolY / 3) {
      return this.handleTopTap(e);
    }
    if (y > (totolY / 3) * 2) {
      return this.handleBottomTap(e);
    }
    return this.handleMidTap(e);
  }
  handleTopTap = () => {

  }
  handleMidTap = () => {
    this.props.requestListShow();
  }
  handleBottomTap = () => {

  }
  render() {
    const { title, content } = this.props.chapter;
    return (
      <Tappable onTap={this.handleTap}>
        <div className={cn.container}>
          <div className={cn.title}>{title}</div>
          <pre className={cn.content}>
            {content.split('\n').map((p, i) => (
              <p key={i} className={cn.paragraph}>{p}</p>
            ))}
          </pre>
        </div>
      </Tappable>
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
  requestListShow: PropTypes.func.isRequired,
};

export default ChapterReader;

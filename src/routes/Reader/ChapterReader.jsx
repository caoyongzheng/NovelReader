import React from 'react';
import PropTypes from 'prop-types';
import cn from './ChapterReader.less';
import Tappable from '../../components/Tappable';
import ScrollView from '../../components/ScrollView';

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
    this.scrollView.prePage();
  }
  handleMidTap = () => {
    this.props.requestListShow();
  }
  handleBottomTap = () => {
    this.scrollView.nextPage();
  }
  render() {
    const { title, content } = this.props.chapter;
    return (
      <ScrollView ref={r => (this.scrollView = r)}>
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
      </ScrollView>
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

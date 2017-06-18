import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cn from './ScrollView.less';
import loadingIcon from '../img/loading.png';

class ScrollView extends React.PureComponent {
  state = {
    ly: 0,
    sy: 0,
    transition: false,
  }
  onTouchStart = (e) => {
    this.startY = e.touches ? e.touches[0].pageY : e.pageY;
    this.setState({ transition: false });
  }
  onTouchMove = (e) => {
    const startY = this.startY;
    const wrap = this.wrap;
    const curY = e.touches ? e.touches[0].pageY : e.pageY;

    const isAtTop = (startY < curY && wrap.scrollTop === 0);
    const isAtBottom = startY > curY &&
    (wrap.scrollHeight - wrap.scrollTop === wrap.offsetHeight);
    if (isAtTop || isAtBottom) {
      e.preventDefault();
      if (isAtTop) {
        const d = curY - startY;
        const { maxMove } = this.props;
        const translateY = maxMove * (d / (d + (maxMove * 1.5)));
        this.setState({ ly: translateY, sy: translateY });
      }
    } else if (wrap.scrollTop < 0) {
      this.setState({ ly: -wrap.scrollTop, sy: 0 });
    }
  }
  onTouchEnd = () => {
    const { ly } = this.state;
    if (ly !== 0) {
      this.setState({ ly, sy: ly });
      const { refreshCallBack } = this.props;
      if (ly >= 50 && !!refreshCallBack) {
        this.begginLoad();
      } else {
        setTimeout(() => {
          this.setState({ ly: 0, sy: 0, transition: true });
        }, 0);
      }
    }
  }
  begginLoad = () => {
    const { refreshCallBack } = this.props;
    if (refreshCallBack) {
      setTimeout(() => {
        this.setState({ ly: 50, sy: 50, transition: true });
        refreshCallBack(() => this.setState({ ly: 0, sy: 0 }));
      }, 0);
    }
  }
  render() {
    const { children } = this.props;
    const { ly, sy, transition } = this.state;
    return (
      <div
        className={cn.scrollview}
      >
        <div
          className={cx(cn.loader, { [cn.transition]: transition })}
          style={{
            transform: `translateY(${ly}px)`,
            WebkitTransform: `translateY(${ly}px)`,
          }}
        >
          <img
            src={loadingIcon}
            alt="loading"
            className={cx({ [cn.spinner]: ly >= 50 })}
          />
        </div>
        <div
          className={
            cx(cn.scrollContent, { [cn.transition]: transition })
          }
          ref={wrap => (this.wrap = wrap)}
          style={{
            transform: `translateY(${sy}px)`,
            WebkitTransform: `translateY(${sy}px)`,
          }}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
        >
          {children}
        </div>
      </div>
    );
  }
}

ScrollView.defaultProps = {
  maxMove: 300,
  refreshCallBack: null,
};

ScrollView.propTypes = {
  children: PropTypes.node.isRequired,
  maxMove: PropTypes.number,
  refreshCallBack: PropTypes.func,
};

export default ScrollView;

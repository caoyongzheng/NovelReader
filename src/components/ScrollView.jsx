import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cn from './ScrollView.less';
import loadingIcon from '../img/loading.png';

const TriggleDis = 50;

class ScrollView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ly: props.loading ? TriggleDis : 0,
      sy: props.loading ? TriggleDis : 0,
      transition: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      if (nextProps.loading) {
        this.scrollTo(0);
        this.setState({ ly: TriggleDis, sy: TriggleDis });
      } else {
        this.setState({ ly: 0, sy: 0 });
      }
    }
  }
  componentWillUnmount() {
    this.unmounted = true;
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
      if (isAtTop && !!this.props.requestLoading) {
        const d = curY - startY;
        const { maxMove } = this.props;
        const translateY = maxMove * (d / (d + (maxMove * 1.5)));
        this.setState({ ly: translateY, sy: translateY, transition: false });
      }
    } else if (wrap.scrollTop < 0 && !!this.props.requestLoading) {
      this.setState({ ly: -wrap.scrollTop, sy: 0 });
    }
  }
  onTouchEnd = () => {
    const { ly } = this.state;
    this.setState({ transition: true });
    if (ly !== 0) {
      this.setState({ ly, sy: ly });
      const { requestLoading } = this.props;
      if (ly >= 50 && !!requestLoading) {
        requestLoading();
      } else {
        setTimeout(() => {
          if (!this.unmounted) {
            this.setState({ ly: 0, sy: 0, transition: true });
          }
        }, 0);
      }
    }
  }
  scrollTo = (scrollTop) => {
    if (this.wrap) {
      this.wrap.scrollTop = scrollTop;
    }
  }
  render() {
    const { children, hide } = this.props;
    const { ly, sy, transition } = this.state;
    return (
      <div
        className={cx(cn.scrollview, { [cn.hide]: hide })}
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
            className={cx({ [cn.spinner]: ly >= TriggleDis })}
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
  loading: false,
  hide: false,
  requestLoading: null,
};

ScrollView.propTypes = {
  children: PropTypes.node.isRequired,
  maxMove: PropTypes.number,
  requestLoading: PropTypes.func,
  loading: PropTypes.bool,
  hide: PropTypes.bool,
};

export default ScrollView;

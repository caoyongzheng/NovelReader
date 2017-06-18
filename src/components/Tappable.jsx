import React from 'react';
import PropTypes from 'prop-types';
import ua from '../utils/ua';

function determineEventType(target) {
  // Issue #159: Android Chrome Select Box does not open with a synthetic click event
  if (ua.sAndroid && target.tagName.toLowerCase() === 'select') {
    return 'mousedown';
  }
  return 'click';
}

function sendClick(target, event) {
  // On some Android devices activeElement needs to be blurred
  // otherwise the synthetic click will have no effect (#24)
  if (document.activeElement && document.activeElement !== target) {
    document.activeElement.blur();
  }

  const touch = event.changedTouches[0];

  // Synthesise a click event, with an extra attribute so it can be tracked
  const clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent(
    determineEventType(target), true, true, window, 1, touch.screenX,
    touch.screenY, touch.clientX, touch.clientY, false, false, false,
    false, 0, null,
  );
  clickEvent.forwardedTouchEvent = true;
  target.dispatchEvent(clickEvent);
}

class Tappable extends React.PureComponent {
  state = {
    active: false,
  }
  componentDidMount() {
    this.el.addEventListener('touchstart', this.onTocuhStart);
    this.el.addEventListener('touchmove', this.onTocuhMove);
    this.el.addEventListener('touchend', this.onTocuhEnd);
    this.el.addEventListener('touchcancel', this.onTouchCancel);
    this.el.addEventListener('click', this.triggerTap);
    this.el.addEventListener('mousedown', this.onMouseDown);
    this.el.addEventListener('mouseup', this.onMouseUp);
  }
  componentDidUpdate() {
    if (this.el && this.props.activeClass) {
      if (this.state.active) {
        this.el.classList.add(this.props.activeClass);
      } else {
        this.el.classList.remove(this.props.activeClass);
      }
    }
  }
  componentWillUnmount() {
    this.el.removeEventListener('touchstart', this.onTocuhStart);
    this.el.removeEventListener('touchmove', this.onTocuhMove);
    this.el.removeEventListener('touchend', this.onTocuhEnd);
    this.el.removeEventListener('touchcancel', this.onTouchCancel);
    this.el.removeEventListener('click', this.triggerTap);
    this.el.removeEventListener('mousedown', this.onMouseDown);
    this.el.removeEventListener('mouseup', this.onMouseUp);
  }
  onTocuhStart = (e) => {
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    this.moved = false;
    this.activePromise = new Promise((resolve) => {
      this.timeout = setTimeout(() => {
        if (!this.moved) this.setState({ active: true });
        resolve({ active: !this.moved, clearTime: false });
      }, this.props.tapDelay);
    });
  }
  onTocuhMove = (e) => {
    if (this.isMoved(e) && !this.moved) {
      this.moved = true;
      this.setState({ active: false });
    }
  }
  onTocuhEnd = (e) => {
    e.preventDefault();
    Promise.race([
      this.activePromise,
      Promise.resolve({ active: !this.moved, clearTime: true }),
    ]).then(({ active, clearTime }) => {
      if (clearTime) window.clearTimeout(this.timeout);
      if (this.state.active) this.setState({ active: false });
      if (!this.moved && active) sendClick(e.target, e);
    });
  }
  onTouchCancel = () => {
    this.setState({ active: false });
  }
  onMouseDown = () => {
    this.setState({ active: true });
  }
  onMouseUp = () => {
    this.setState({ active: false });
  }
  triggerTap = (e) => {
    this.props.onTap(e);
  }
  isMoved = (e) => {
    const { touchBoundary } = this.props;
    const touch = e.changedTouches[0];
    if (
      Math.abs(touch.pageX - this.startX) > touchBoundary ||
      Math.abs(touch.pageY - this.startY) > touchBoundary
    ) {
      return true;
    }
    return false;
  }
  render() {
    return React.cloneElement(this.props.children, {
      ref: el => (this.el = el),
    });
  }
}

Tappable.defaultProps = {
  onTap: () => {},
  touchBoundary: 5,
  tapDelay: 50,
  activeClass: '',
};

Tappable.propTypes = {
  children: PropTypes.node.isRequired,
  onTap: PropTypes.func,
  activeClass: PropTypes.string,
  touchBoundary: PropTypes.number,
  tapDelay: PropTypes.number,
};

export default Tappable;

import React from 'react';
import PropTypes from 'prop-types';
import cn from './Header.less';

function Header({ left, title, right }) {
  return (
    <div className={cn.header}>
      <div className={cn.left}>
        {left}
      </div>
      <div className={cn.center}>{title}</div>
      <div className={cn.right}>{right}</div>
    </div>
  );
}

Header.defaultProps = {
  left: '',
  title: '',
  right: '',
};

Header.propTypes = {
  left: PropTypes.node,
  title: PropTypes.string,
  right: PropTypes.node,
};

export default Header;

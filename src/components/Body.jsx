import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import cn from './Body.less';

function Body({ top, bottom, children, className }) {
  return (
    <div className={cx(cn.container, className)} style={{ top, bottom }}>
      {children}
    </div>
  );
}

Body.defaultProps = {
  top: '45px',
  bottom: '50px',
  children: null,
  className: '',
};

Body.propTypes = {
  top: PropTypes.string,
  bottom: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Body;

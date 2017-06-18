import React from 'react';
import PropTypes from 'prop-types';
import cn from './Body.less';

function Body({ top, bottom, children }) {
  return (
    <div className={cn.container} style={{ top, bottom }}>
      {children}
    </div>
  );
}

Body.defaultProps = {
  top: '45px',
  bottom: '50px',
  children: null,
};

Body.propTypes = {
  top: PropTypes.string,
  bottom: PropTypes.string,
  children: PropTypes.node,
};

export default Body;

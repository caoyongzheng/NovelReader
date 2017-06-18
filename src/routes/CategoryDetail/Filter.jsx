import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cn from './Filter.less';
import Tappable from '../../components/Tappable';

function Filter({ filters, active, onSelect }) {
  return (
    <div className={cn.container}>
      {
        filters.map(({ key, name }) => (
          <Tappable key={key} onTap={() => onSelect(key)}>
            <span
              key={key}
              className={cx(cn.item, { [cn.active]: active === key })}
            >
              {name}
            </span>
          </Tappable>
        ))
      }
    </div>
  );
}

Filter.defaultProps = {};

Filter.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  active: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default Filter;

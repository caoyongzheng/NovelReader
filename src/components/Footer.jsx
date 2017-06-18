import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import cn from './Footer.less';
import Tappable from './Tappable';

const items = [
  { key: 'bookshelf', name: '书架' },
  { key: 'category', name: '分类' },
  { key: 'ranking', name: '排行榜' },
];

function Footer({ active, replace }) {
  return (
    <div className={cn.footer}>
      {items.map(o => (
        <Tappable
          key={o.key}
          onTap={active !== o.key ? () => replace(`/${o.key}`) : undefined}
          activeClass={cn.clickActive}
        >
          <div className={cx(cn.item, { [cn.active]: active === o.key })}>
            {o.name}
          </div>
        </Tappable>
      ))}
    </div>
  );
}

Footer.defaultProps = {};

Footer.propTypes = {
  active: PropTypes.string.isRequired,
  replace: PropTypes.func.isRequired,
};

export default Footer;

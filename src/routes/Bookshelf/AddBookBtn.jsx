import React from 'react';
import PropTypes from 'prop-types';
import cn from './AddBookBtn.less';
import Tappable from '../../components/Tappable';

function AddBookBtn({ vIf, push }) {
  if (!vIf) return null;
  return (
    <div className={cn.container}>
      <Tappable
        activeClass={cn.clickActive}
        onTap={() => push('/category')}
      >
        <div className="btn-primary font-big">
          {'添加小说'}
        </div>
      </Tappable>
    </div>
  );
}

AddBookBtn.defaultProps = {
  vIf: true,
};

AddBookBtn.propTypes = {
  vIf: PropTypes.bool,
  push: PropTypes.func.isRequired,
};

export default AddBookBtn;

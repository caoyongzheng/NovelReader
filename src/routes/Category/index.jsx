import React from 'react';
import PropTypes from 'prop-types';
import cn from './index.less';
import Header from '../../components/Header';
import Body from '../../components/Body';
import Footer from '../../components/Footer';
import ScrollView from '../../components/ScrollView';

const kinds = [
  { key: 'male', name: '男生' },
  { key: 'female', name: '女生' },
  { key: 'press', name: '出版' },
];

class Category extends React.PureComponent {
  componentDidMount() {
    if (!this.props.getted) {
      this.scroller.begginLoad();
    }
  }
  render() {
    const { replace, category, getData } = this.props;
    return (
      <div className={cn.route}>
        <Header title="分类" />
        <Body>
          <ScrollView
            ref={scroller => (this.scroller = scroller)}
            refreshCallBack={getData}
          >
            {kinds.map(({ key, name }) =>
              (<div key={key} className={cn.kind}>
                <div className={cn.name}>
                  {name}
                </div>
                <div className={cn.items}>
                  {category[key].map(({ name: kindName, bookCount }) =>
                    (<div key={kindName} className={cn.item}>
                      <div className={cn.center}>
                        <div className={cn.kindName}>{kindName}</div>
                        <div className={cn.bookCount}>{bookCount}</div>
                      </div>
                    </div>),
                  )}
                </div>
              </div>),
            )}
          </ScrollView>
        </Body>
        <Footer active="category" replace={replace} />
      </div>
    );
  }
}

Category.defaultProps = {};

Category.propTypes = {
  replace: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  category: PropTypes.shape({
    male: PropTypes.array.isRequired,
    female: PropTypes.array.isRequired,
    press: PropTypes.array.isRequired,
  }).isRequired,
  getted: PropTypes.bool.isRequired,
};

export default Category;

import React from 'react';
import PropTypes from 'prop-types';
import qs from 'querystringify';
import cn from './index.less';
import Header from '../../components/Header';
import Body from '../../components/Body';
import Footer from '../../components/Footer';
import ScrollView from '../../components/ScrollView';
import Tappable from '../../components/Tappable';

const kinds = [
  { key: 'male', name: '男生' },
  { key: 'female', name: '女生' },
  { key: 'press', name: '出版' },
];

class Category extends React.PureComponent {
  componentDidMount() {
    if (!this.props.category.getted) {
      this.scroller.begginLoad();
    }
  }
  handleTap = (cat, major) => {
    const { search, push } = this.props;
    const qsObj = qs.parse(search);
    qsObj.cat = cat;
    qsObj.major = major;
    push(`/category/detail?${qs.stringify(qsObj)}`);
  }
  render() {
    const { replace, category, getCategory } = this.props;
    return (
      <div className={cn.route}>
        <Header title="分类" />
        <Body>
          <ScrollView
            ref={scroller => (this.scroller = scroller)}
            refreshCallBack={getCategory}
          >
            {kinds.map(({ key, name }) =>
              (<div key={key} className={cn.kind}>
                <div className={cn.name}>
                  {name}
                </div>
                <div className={cn.items}>
                  {category[key].map(({ name: kindName, bookCount }) => (
                    <Tappable
                      key={kindName}
                      onTap={() => this.handleTap(key, kindName)}
                      activeClass={cn.clickActive}
                    >
                      <div className={cn.item}>
                        <div className={cn.center}>
                          <div className={cn.kindName}>{kindName}</div>
                          <div className={cn.bookCount}>{bookCount}</div>
                        </div>
                      </div>
                    </Tappable>
                  ))}
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
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  getCategory: PropTypes.func.isRequired,
  category: PropTypes.shape({
    male: PropTypes.array.isRequired,
    female: PropTypes.array.isRequired,
    press: PropTypes.array.isRequired,
    getted: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Category;

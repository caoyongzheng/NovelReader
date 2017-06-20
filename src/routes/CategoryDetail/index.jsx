import React from 'react';
import PropTypes from 'prop-types';
import qs from 'querystringify';
import find from 'lodash/find';
import get from 'lodash/get';
import cn from './index.less';
import Header from '../../components/Header';
import Body from '../../components/Body';
import ScrollView from '../../components/ScrollView';
import Filter from './Filter';
import BookList from './BookList';

const filter1 = [
  { key: 'hot', name: '热门' },
  { key: 'new', name: '新书' },
  { key: 'reputation', name: '好评' },
  { key: 'over', name: '完结' },
  { key: 'month', name: '包月' },
];

class CategoryDetail extends React.PureComponent {
  state = {
    categoryBookList: [],
    categoryBookListEnd: false,
  }
  componentDidMount() {
    const { getCategoryL2, categoryL2 } = this.props;
    if (!categoryL2.getted) {
      getCategoryL2();
    }
    this.scroller.begginLoad();
  }
  componentDidUpdate(preProps) {
    const { search } = this.props;
    if (search !== preProps.search) {
      this.scroller.begginLoad();
    }
  }
  onFilter1Select = (key) => {
    const { search, replace } = this.props;
    const searchObj = qs.parse(search);
    searchObj.type = key;
    replace(`/category/detail?${qs.stringify(searchObj)}`);
  }
  onFilter2Select = (key) => {
    const { search, replace } = this.props;
    const searchObj = qs.parse(search);
    if (key === 'all') {
      delete searchObj.minor;
    } else {
      searchObj.minor = key;
    }
    replace(`/category/detail?${qs.stringify(searchObj)}`);
  }
  getCategoryBookList = (searchObj, cb) => {
    const origin = 'https://api.zhuishushenqi.com/book/by-categories';
    const url = encodeURIComponent(`${origin}?${qs.stringify(searchObj)}`);
    const { start } = searchObj;
    return fetch(`${process.env.PROXY_API}?url=${url}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then(({ books, total }) => {
      const { categoryBookList } = this.state;
      const list = categoryBookList.slice(0, start).concat(books);
      this.setState({
        categoryBookList: list,
        categoryBookListEnd: total <= list.length,
      });
      if (cb) cb();
    });
  }
  getActiveType = () => {
    const { search } = this.props;
    const searchObj = qs.parse(search);
    return get(
      find(filter1, { key: searchObj.type }),
      ['key'],
      filter1[0].key,
    );
  }
  getActiveMinor = (filter2) => {
    const { search } = this.props;
    const searchObj = qs.parse(search);
    const mins = this.computeMins(get(filter2, ['mins'], []));
    if (mins.length === 0) return '';
    return get(
      find(mins, { key: searchObj.minor }),
      ['key'],
      mins[0].key,
    );
  }
  getFilter2 = (major, majorList) => find(majorList, { major })
  refreshCallBack = (cb) => {
    const { search } = this.props;
    const searchObj = qs.parse(search);
    this.getCategoryBookList({
      gender: searchObj.gender || '',
      type: this.getActiveType(),
      major: searchObj.major || '',
      minor: searchObj.minor || '',
      start: 0,
      limit: 15,
    }).then(cb);
  }
  computeMins = mins => ([
    { key: 'all', name: '全部' },
    ...mins.map(m => ({ key: m, name: m })),
  ])
  render() {
    const {
      search,
      categoryL2: { male, female, press },
    } = this.props;
    const { categoryBookList } = this.state;
    const searchObj = qs.parse(search);
    const filter2 = this.getFilter2(
      searchObj.major,
      [...male, ...female, ...press],
    );
    return (
      <div className={cn.route}>
        <Header title={searchObj.major} />
        <Body bottom="0px" className={cn.body}>
          <Filter
            key="filter1"
            filters={filter1}
            active={this.getActiveType()}
            onSelect={this.onFilter1Select}
          />
          {
            filter2 && filter2.mins.length > 0 ? (
              <Filter
                key="filter2"
                filters={this.computeMins(filter2.mins)}
                active={this.getActiveMinor(filter2)}
                onSelect={this.onFilter2Select}
              />
            ) : null
          }
          <div className={cn.booklist}>
            <ScrollView
              ref={scroller => (this.scroller = scroller)}
              refreshCallBack={this.refreshCallBack}
            >
              <BookList list={categoryBookList} />
            </ScrollView>
          </div>
        </Body>
      </div>
    );
  }
}

CategoryDetail.defaultProps = {};

CategoryDetail.propTypes = {
  search: PropTypes.string.isRequired,
  replace: PropTypes.func.isRequired,
  getCategoryL2: PropTypes.func.isRequired,
  categoryL2: PropTypes.shape({
    male: PropTypes.array.isRequired,
    female: PropTypes.array.isRequired,
    press: PropTypes.array.isRequired,
    getted: PropTypes.bool.isRequired,
  }).isRequired,
};

export default CategoryDetail;

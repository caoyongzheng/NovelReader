import React from 'react';
import PropTypes from 'prop-types';
import qs from 'querystringify';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cn from './index.less';
import Header from '../../components/Header';
import Body from '../../components/Body';
import Filter from './Filter';
import BookList from './BookList';
import handleReject from '../../utils/handleReject';

const filter1 = [
  { key: 'hot', name: '热门' },
  { key: 'new', name: '新书' },
  { key: 'reputation', name: '好评' },
  { key: 'over', name: '完结' },
  { key: 'monthly', name: '包月' },
];

class CategoryDetail extends React.PureComponent {
  state = {
    categoryBooks: {},
  }
  componentDidMount() {
    const { getCategoryL2, categoryL2 } = this.props;
    if (!categoryL2.getted) {
      getCategoryL2();
    }
    const { search } = this.props;
    this.requestLoading(this.getCategoryKey(search));
  }
  componentDidUpdate(preProps) {
    const { search } = this.props;
    const key = this.getCategoryKey(search);
    if (search !== preProps.search && !this.state.categoryBooks[key]) {
      this.requestLoading(key);
    }
  }
  onScrollBottom = (key) => {
    if (this.state[`isGetting_${key}`]) return;
    this.setState({ [`isGetting_${key}`]: true });
    const obj = get(this.state.categoryBooks, [key], { list: [] });
    this.getCategoryBookList({
      ...qs.parse(key),
      limit: 15,
      start: obj.list.length,
    }).then(() => {
      this.setState({ [`isGetting_${key}`]: false });
    });
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
      searchObj.minor = '';
    } else {
      searchObj.minor = key;
    }
    replace(`/category/detail?${qs.stringify(searchObj)}`);
  }
  getCategoryBookList = (searchObj, cb) => {
    const search = qs.stringify(searchObj);
    const origin = 'https://api.zhuishushenqi.com/book/by-categories';
    const url = encodeURIComponent(`${origin}?${search}`);
    return fetch(`${process.env.PROXY_API}?url=${url}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then(({ books, total }) => {
      const categoryBooks = { ...this.state.categoryBooks };
      const key = this.getCategoryKey(qs.stringify(searchObj));
      const catObj = categoryBooks[key] || {};
      catObj.list = (catObj.list || []).slice(0, searchObj.start).concat(books);
      catObj.end = total <= catObj.list.length;
      categoryBooks[key] = catObj;
      this.setState({ categoryBooks });
      if (cb) cb();
    }).catch(handleReject);
  }
  getCategoryKey = (search) => {
    const { type = '', gender = '', major = '', minor = '' } = qs.parse(search);
    return qs.stringify({
      type: this.getActiveType(type),
      gender,
      major,
      minor,
    });
  }
  getActiveType = type => get(
    find(filter1, { key: type }),
    ['key'],
    filter1[0].key,
  )
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
  requestLoading = (key) => {
    const keyObj = qs.parse(key);
    const { categoryBooks } = this.state;
    categoryBooks[key] = categoryBooks[key] || { list: [], end: false };
    this.setState({ [`${key}_loading`]: true, categoryBooks: { ...categoryBooks } });
    this.getCategoryBookList({
      gender: keyObj.gender || '',
      type: keyObj.type,
      major: keyObj.major || '',
      minor: keyObj.minor || '',
      start: 0,
      limit: 15,
    }).then(() => this.setState({ [`${key}_loading`]: false }));
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
    const { categoryBooks } = this.state;
    const { type = '', major = '' } = qs.parse(search);
    const filter2 = this.getFilter2(
      major,
      [...male, ...female, ...press],
    );
    const activeObj = qs.parse(this.getCategoryKey(search));
    return (
      <div className={cn.route}>
        <Header title={major} />
        <Body bottom="0px" className={cn.body}>
          <Filter
            key="filter1"
            filters={filter1}
            active={this.getActiveType(type)}
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
            {
              Object.keys(categoryBooks).map(k => (
                <BookList
                  key={k}
                  id={k}
                  hide={!isEqual(qs.parse(k), activeObj)}
                  loading={this.state[`${k}_loading`]}
                  list={categoryBooks[k].list}
                  requestLoading={this.requestLoading}
                  onScrollBottom={this.onScrollBottom}
                  getting={!!this.state[`isGetting_${k}`]}
                />
              ))
            }
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

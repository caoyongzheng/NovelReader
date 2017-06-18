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

const filter1 = [
  { key: 'hot', name: '热门' },
  { key: 'new', name: '新书' },
  { key: 'repulation', name: '好评' },
  { key: 'over', name: '完结' },
  { key: 'month', name: '包月' },
];

class CategoryDetail extends React.PureComponent {
  state = {}
  componentDidMount() {
    this.scroller.begginLoad();
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
      delete searchObj.min;
    } else {
      searchObj.min = key;
    }
    replace(`/category/detail?${qs.stringify(searchObj)}`);
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
  getActiveMin = (filter2) => {
    const { search } = this.props;
    const searchObj = qs.parse(search);
    const mins = this.computeMins(filter2.mins);
    return get(
      find(mins, { key: searchObj.min }),
      ['key'],
      mins[0].key,
    );
  }
  getFilter2 = (major, majorList) => find(majorList, { major })
  refreshCallBack = (cb) => {
    const { categoryL2, getCategoryL2 } = this.props;
    const reqs = [];
    if (!categoryL2.getted) {
      reqs.push(getCategoryL2());
    }
    if (reqs.length > 0) {
      Promise.all(reqs).then(() => cb());
    } else {
      cb();
    }
  }
  computeMins = mins => ([
    { key: 'all', name: '全部' },
    ...mins.map(m => ({ key: m, name: m })),
  ])
  render() {
    const { search, categoryL2: { male, female, press } } = this.props;
    const searchObj = qs.parse(search);
    const filter2 = this.getFilter2(
      searchObj.major,
      [...male, ...female, ...press],
    );
    return (
      <div className={cn.route}>
        <Header title={searchObj.major} />
        <Body bottom="0px">
          <ScrollView
            ref={scroller => (this.scroller = scroller)}
            refreshCallBack={this.refreshCallBack}
          >
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
                  active={this.getActiveMin(filter2)}
                  onSelect={this.onFilter2Select}
                />
              ) : null
            }
          </ScrollView>
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

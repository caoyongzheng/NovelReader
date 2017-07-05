import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import get from 'lodash/get';
import Bookshelf from './routes/Bookshelf';
import Category from './routes/Category';
import CategoryDetail from './routes/CategoryDetail';
import Ranking from './routes/Ranking';
import Book from './routes/Book';
import Reader from './routes/Reader';

class App extends React.PureComponent {
  state = {
    category: {
      getted: false,
      male: [],
      female: [],
      press: [],
    },
    categoryL2: {
      getted: false,
      male: [],
      female: [],
      press: [],
    },
  };
  getCategory = (cb) => {
    const url = 'http://api.zhuishushenqi.com/cats/lv2/statistics';
    return fetch(`${process.env.PROXY_API}?url=${url}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then(({ male, female, press }) => {
      this.setState({
        category: {
          male,
          female,
          press,
          getted: true,
        },
      });
      if (cb) cb();
    });
  };
  getCategoryL2 = (cb) => {
    const url = 'http://api.zhuishushenqi.com/cats/lv2';
    return fetch(`${process.env.PROXY_API}?url=${url}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then(({ male, female, press }) => {
      this.setState({
        categoryL2: {
          male,
          female,
          press,
          getted: true,
        },
      });
      if (cb) cb();
    });
  }
  render() {
    const { category, categoryL2 } = this.state;
    return (
      <Router>
        <div style={{ width: '100%', height: '100%' }}>
          <Route exact path="/" render={() => <Redirect to="/bookshelf" />} />
          <Route
            path="/bookshelf"
            render={({ history: { push, replace } }) => <Bookshelf push={push} replace={replace} />}
          />
          <Route
            exact
            path="/category"
            render={({ history: { push, replace, location } }) => (
              <Category
                search={location.search}
                replace={replace}
                push={push}
                category={category}
                getCategory={this.getCategory}
              />
            )}
          />
          <Route
            path="/category/detail"
            render={({ history }) => (
              <CategoryDetail
                history={history}
                search={history.location.search}
                categoryL2={categoryL2}
                getCategoryBookList={this.getCategoryBookList}
                getCategoryL2={this.getCategoryL2}
              />
            )}
          />
          <Route
            path="/ranking"
            render={({ history: { push, replace } }) => <Ranking push={push} replace={replace} />}
          />
          <Route
            path="/book/:id"
            render={({ history, match }) => (
              <Book
                id={get(match, ['params', 'id'], '')}
                history={history}
              />
            )}
          />
          <Route
            path="/reader/:id"
            render={({ history, match }) => (
              <Reader
                id={get(match, ['params', 'id'], '')}
                history={history}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

App.defaultProps = {};

App.propTypes = {};

export default App;

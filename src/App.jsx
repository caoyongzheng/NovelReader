import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Bookshelf from './routes/Bookshelf';
import Category from './routes/Category';
import Ranking from './routes/Ranking';

class App extends React.PureComponent {
  state = {
    category: {
      getted: false,
      category: {
        male: [],
        female: [],
        press: [],
      },
    },
  };
  getCategoryData = (cb) => {
    const url = 'http://api.zhuishushenqi.com/cats/lv2/statistics';
    fetch(`${process.env.PROXY_API}?url=${url}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then(({ male, female, press }) => {
      this.setState({
        category: {
          category: { male, female, press },
          getted: true,
        },
      });
      if (cb) cb();
    });
  };
  render() {
    const { category } = this.state;
    return (
      <Router>
        <div style={{ width: '100%', height: '100%' }}>
          <Route exact path="/" render={() => <Redirect to="/bookshelf" />} />
          <Route
            path="/bookshelf"
            render={({ history: { push, replace } }) => <Bookshelf push={push} replace={replace} />}
          />
          <Route
            path="/category"
            render={({ history: { push, replace } }) =>
              (<Category
                push={push}
                replace={replace}
                {...category}
                getData={this.getCategoryData}
              />)}
          />
          <Route
            path="/ranking"
            render={({ history: { push, replace } }) => <Ranking push={push} replace={replace} />}
          />
        </div>
      </Router>
    );
  }
}

App.defaultProps = {};

App.propTypes = {};

export default App;

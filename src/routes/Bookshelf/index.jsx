import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import Header from '../../components/Header';
import Body from '../../components/Body';
import Footer from '../../components/Footer';
import AddBookBtn from './AddBookBtn';
import ScrollView from '../../components/ScrollView';

class Bookshelf extends React.PureComponent {
  state = {
    bookList: [],
  }
  render() {
    const { replace, push } = this.props;
    const { bookList } = this.state;
    return (
      <div className={styles.route}>
        <Header title="书架" />
        <Body>
          <ScrollView>
            <AddBookBtn vIf={!bookList.length} push={push} />
          </ScrollView>
        </Body>
        <Footer
          active="bookshelf"
          replace={replace}
        />
      </div>
    );
  }
}

Bookshelf.defaultProps = {};

Bookshelf.propTypes = {
  replace: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

export default Bookshelf;

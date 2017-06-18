import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import Header from '../../components/Header';
import Body from '../../components/Body';
import Footer from '../../components/Footer';
import ScrollView from '../../components/ScrollView';

class Ranking extends React.PureComponent {
  state = {}
  render() {
    const { replace } = this.props;
    return (
      <div className={styles.route}>
        <Header title="排行榜" />
        <Body>
          <ScrollView>
            1
          </ScrollView>
        </Body>
        <Footer active="ranking" replace={replace} />
      </div>
    );
  }
}

Ranking.defaultProps = {};

Ranking.propTypes = {
  replace: PropTypes.func.isRequired,
};

export default Ranking;

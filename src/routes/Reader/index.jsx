import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cn from './index.less';
import handleReject from '../../utils/handleReject';
import ChapterList from './ChapterList';
import ChapterReader from './ChapterReader';

class Reader extends React.PureComponent {
  state = {
    chapters: [],
    showList: false,
    chapter: {
      title: '',
      content: '',
    },
    sources: [],
  }
  componentWillMount() {
    this.getSources()
    .then(() => this.getChapterList(get(this.state.sources, ['0', '_id'])))
    .then((chapters) => {
      const link = get(chapters, ['0', 'link']);
      if (link) this.getChapter(link);
    });
  }
  getSources = () => {
    const { id } = this.props;
    const url = `http://api.zhuishushenqi.com/btoc?view=summary&book=${id}`;
    return fetch(`${process.env.PROXY_API}?url=${encodeURIComponent(url)}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then((data) => {
      this.setState({ sources: data });
      return data;
    }).catch(handleReject);
  }
  getChapterList = (id) => {
    const url = `http://api.zhuishushenqi.com/btoc/${id}?view=chapters`;
    return fetch(`${process.env.PROXY_API}?url=${encodeURIComponent(url)}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then(({ chapters }) => {
      this.setState({ chapters });
      return chapters;
    }).catch(handleReject);
  }
  getChapter = (link) => {
    const url = `https://chapterup.zhuishushenqi.com/chapter/${link}`;
    return fetch(`${process.env.PROXY_API}?url=${encodeURIComponent(url)}`, {
      mode: 'cors',
    }).then(res => res.json())
    .then(({ chapter: { title, cpContent }, ok }) => {
      if (!ok) {
        handleReject('not ok');
      } else {
        this.setState({
          chapter: {
            title,
            content: cpContent,
          },
        });
      }
    }).catch(handleReject);
  }
  handleListClose = () => this.setState({ showList: false })
  handleListShow = () => this.setState({ showList: true })
  render() {
    const { chapters, showList, chapter } = this.state;
    return (
      <div className={cn.container}>
        {
          showList ? (
            <ChapterList
              chapters={chapters}
              requestClose={this.handleListClose}
            />
          ) : null
        }
        <ChapterReader
          chapter={chapter}
          requestListShow={this.handleListShow}
        />
      </div>
    );
  }
}

Reader.defaultProps = {};

Reader.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Reader;

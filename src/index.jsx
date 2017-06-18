import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.less';
import App from './App';

const anchorEl = document.createElement('div');
anchorEl.classList.add(styles.anchor);

document.body.appendChild(anchorEl);

ReactDOM.render(<App />, anchorEl);

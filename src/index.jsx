import React from 'react';
import ReactDOM from 'react-dom';
// solve the problem of parcel build dependency
import '@ctrl/tinycolor';

import Router from './router';
import './index.less';

ReactDOM.render(<Router />, document.getElementById('app'));

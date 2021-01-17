import './common/init';
import React from 'react';
import ReactDOM from 'react-dom';
import { setupAppear } from 'appear-polyfill';
import "antd/dist/antd.css";

import Router from './router';
import './index.less';

if (window) {setupAppear()}

ReactDOM.render(<Router />, document.getElementById('app'));

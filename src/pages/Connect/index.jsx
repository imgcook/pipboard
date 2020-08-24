import React, { Component } from 'react';
import { Icon } from '@alifd/next';
import './index.scss';

export default class Connect extends Component {
  state = {
    // TODO
  }

  render() {
    const guide = [
      '$ npm install -g @pipcook/pipcook-cli',
      '$ pipcook init',
      '$ pipcook daemon start',
    ];
    return <div className="connect">
      <Icon type="cry" size="xxl" />
      <p>
        No found Pipcook on your local environment, you can install via the following commands, or read the <a href="https://alibaba.github.io/pipcook/#/INSTALL">install manual</a>.
      </p>
      <pre>{guide.join('\n')}</pre>
    </div>;
  }
}

import React, { Component } from 'react';
import { Icon } from '@alifd/next';
import { getPipcook, redirect } from '@/utils/common';
import './index.scss';

export default class Connect extends Component {
  
  pipcook = getPipcook()

  state = {}

  async componentWillMount() {
    try {
      await this.pipcook.pipeline.list({ offset: 0, limit: 1 });
      // TODO: redirect to history.back()?
      redirect('/pipeline');
    } catch (err) {
      // just catch the error.
    }
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

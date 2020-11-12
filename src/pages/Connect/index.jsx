import React, { Component } from 'react';
import { Icon } from '@alifd/next';
import { getPipcook } from '@/utils/common';
import './index.scss';

export default class Connect extends Component {
  
  pipcook = getPipcook()

  state = {
    disconnected: false,
  }

  async componentWillMount() {
    try {
      await this.pipcook.pipeline.list({ offset: 0, limit: 1 });
      this.props.history.push('/pipeline');
    } catch (err) {
      // just catch the error.
      this.setState({ disconnected: true });
    }
  }

  render() {
    if (!this.state.disconnected) {
      return <div />;
    }
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

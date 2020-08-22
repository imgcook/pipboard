import React, { Component } from 'react';
import { Input, Tab, Tag, Form, Button } from '@alifd/next';
import { getPipcook } from '@/utils/common';
import './index.scss';

class OverviewSetting extends Component {

  state = {
    versions: { daemon: '1.1.0' },
  }

  render () {
    const formItemLayout = {
      labelCol: {
        fixedSpan: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return <Form {...formItemLayout}>
      <Form.Item label="Daemon" help="the pipcook daemon.">
        <Tag size="small">v{this.state.versions.daemon}</Tag>
      </Form.Item>
    </Form>;
  }
}

class DaemonSetting extends Component {
  state = {
    config: {
      npmRegistryPrefix: '',
      pythonIndexMirror: '',
      pythonCondaMirror: '',
    },
  }

  createConfigSetter = (name) => {
    return (v) => {
      this.setState(({ config }) => {
        const newConfig = Object.assign({}, config);
        newConfig[name] = v;
        return { config: newConfig };
      });
    };
  }

  render () {
    const formItemLayout = {
      labelCol: {
        fixedSpan: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return <Form {...formItemLayout}>
      <Form.Item label="NPM Registry" help="The NPM registry prefix to install all plugin.">
        <Input value={this.state.config.npmRegistryPrefix} onChange={this.createConfigSetter('npmRegistryPrefix')} />
      </Form.Item>
      <Form.Item label="Python Index" help="The index page to install Python packages.">
        <Input value={this.state.config.pythonIndexMirror} onChange={this.createConfigSetter('pythonIndexMirror')} />
      </Form.Item>
      <Form.Item label="Python Interrupter Mirror" help="The mirror address to install Python interrupter.">
        <Input value={this.state.config.pythonCondaMirror} onChange={this.createConfigSetter('pythonCondaMirror')} />
      </Form.Item>
    </Form>;
  }
}

class PluginSetting extends Component {
  state = {
    installedPlugins: 0,
  }

  async componentDidMount() {
    const pipcook = getPipcook();
    this.setState({
      installedPlugins: await pipcook.plugin.list()
    });
  }

  render () {
    const formItemLayout = {
      labelCol: {
        fixedSpan: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return <Form {...formItemLayout}>
      <Form.Item label="Installed plugins">
        <p>{this.state.installedPlugins.length} plugins are installed</p>
      </Form.Item>
      <Form.Item label="Operations" help="This removes all installed plugins.">
        <Button warning>Remove All Plugins</Button>
      </Form.Item>
    </Form>;
  }
}

export default function () {
  return (
    <div className="setting">
      <h1>Settings</h1>
      <Tab className="setting-container" tabPosition="left" shape="wrapped">
        <Tab.Item title="Overview">
          <OverviewSetting />
        </Tab.Item>
        <Tab.Item title="Daemon">
          <DaemonSetting />
        </Tab.Item>
        <Tab.Item title="Plugins">
          <PluginSetting />
        </Tab.Item>
      </Tab>
    </div>
  );
}

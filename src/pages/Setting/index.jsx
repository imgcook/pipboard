import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Row, Button, Tag, Input, Form, Tooltip } from 'antd';
import { getPipcook } from '~/common/service';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const pipcook = getPipcook();

export default function Setting() {
  const [versions, setVersions] = useState({
    daemon: undefined,
  });
  const [config, setConfig] = useState({
    npmRegistryPrefix: '',
    pythonIndexMirror: '',
    pythonCondaMirror: '',
  });
  const [installedPlugins, setInstalledPlugins] = useState([]);

  useEffect(() => {
    (async function() {
      const data = await pipcook.listVersions();
      setVersions(data.versions);
    })();
    (async function() {
      const data = await pipcook.getConfig();
      setConfig(data);
    })();
    (async function() {
      const data = await pipcook.plugin.list();
      setInstalledPlugins(data);
    })();
  }, []);

  return <>
    <Title level={2} style={{marginBottom: 30}}>Settings</Title>
    <Tabs tabPosition="left" type="card">
      <TabPane tab="Overview" key="1">
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} colon={false}>
          <Form.Item label="daemon">
            <Form.Item name="remote" noStyle>
              <Tag>{versions.daemon}</Tag>
            </Form.Item>
            <Tooltip title="Useful information">
              <Text type="secondary">the daemon version.</Text>
            </Tooltip>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Daemon" key="2">
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} colon={false}>
          <Form.Item label="remote">
            <Form.Item name="remote" noStyle>
              <Input defaultValue="http://localhost:6927" />
            </Form.Item>
            <Tooltip title="Useful information">
              <Text type="secondary">The remote url prefix to Daemon</Text>
            </Tooltip>
          </Form.Item>
          <Form.Item label="NPM Registry">
            <Form.Item name="npmRegistry" noStyle>
              <Input value={config.npmRegistryPrefix} />
            </Form.Item>
            <Tooltip title="Useful information">
              <Text type="secondary">The NPM registry prefix to install all plugin.</Text>
            </Tooltip>
          </Form.Item>
          <Form.Item label="Python Index">
            <Form.Item name="pythonIndex" noStyle>
              <Input value={config.pythonIndexMirror} />
            </Form.Item>
            <Tooltip title="Useful information">
              <Text type="secondary">The index page to install Python packages.</Text>
            </Tooltip>
          </Form.Item>
          <Form.Item label="Python Interrupter Mirror">
            <Form.Item name="pythonMirror" noStyle>
              <Input value={config.pythonCondaMirror} />
            </Form.Item>
            <Tooltip title="Useful information">
              <Text type="secondary">The mirror address to install Python interrupter.</Text>
            </Tooltip>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Plugins" key="3">
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} colon={false}>
          <Form.Item label="Installed plugins">
            <Form.Item style={{ marginBottom: 0 }}>
              <Text>{installedPlugins.length} plugins are installed</Text>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Operations">
            <Form.Item style={{ marginBottom: 0 }}>
              <Button danger disabled>Remove All Plugins</Button>
              <Row>
                <Text type="secondary">This removes all installed plugins.</Text>
              </Row>
            </Form.Item>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  </>;
};

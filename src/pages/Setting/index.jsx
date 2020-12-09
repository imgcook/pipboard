import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Tabs, Space, Tag, Input, Form, Tooltip } from 'antd';
import { getPipcook } from '~/common/service';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const pipcook = getPipcook();

export default function Setting() {
  const [versions, setVersions] = useState({
    daemon: undefined,
  });

  useEffect(() => {
    (async function() {
      const data = await pipcook.listVersions();
      setVersions(data.versions);
    })();
  }, []);

  return <>
    <Title level={2} style={{marginBottom: 30}}>Settings</Title>
    <Tabs tabPosition="left" type="card">
      <TabPane tab="Overview" key="1">
        <Row>
          <Col offset={1}>
            <Space>
              Daemon
              <Tag>{versions.daemon}</Tag>
              <Text type="secondary">the pipcook daemon.</Text>
            </Space>
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Daemon" key="2">
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="Remote">
            <Form.Item
              name="remote"
              noStyle
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input style={{ width: 160 }} placeholder="Please input" />
            </Form.Item>
            <Tooltip title="Useful information">
              <a href="#API" style={{ margin: '0 8px' }}>
                Need Help?
              </a>
            </Tooltip>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Plugins" key="3">Plugins</TabPane>
    </Tabs>
  </>;
};

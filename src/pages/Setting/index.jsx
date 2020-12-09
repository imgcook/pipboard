import React from "react";
import { Row, Col, Typography, Tabs, Space, Tag, Input } from 'antd';

const { Title, Text } = Typography;

const { TabPane } = Tabs;

export default function Setting() {
  return <>
    <Title level={2} style={{marginBottom: 30}}>Settings</Title>
    <Tabs tabPosition="left" type="card">
      <TabPane tab="Overview" key="1">
        <Row>
          <Col offset={1}>
            <Space>
              Daemon
              <Tag>v1.2.0</Tag>
              <Text type="secondary">the pipcook daemon.</Text>
            </Space>
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Daemon" key="2">
        <Row gutter={1}>
          <Col offset={1} span={3} style={{textAlign: "right"}}>Remote</Col>
          <Col span={4}>
            <Input placeholder="Basic usage" />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Plugins" key="3">Plugins</TabPane>
    </Tabs>
  </>;
};

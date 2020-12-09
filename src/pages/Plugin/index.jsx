import React, { useState } from "react";
import { Row, Col, Input, Select, Typography, List, Tag, Space, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

export default function Plugin() {

  const [pluginLength, setPluginLength] = useState(0);

  const onSearch = value => console.log(value);

  const handleChange = value => {
    console.log(`selected ${value}`);
  }

  return (
    <div className="plugin">
      <Row gutter={[0, 9]}>
        <Col span={24}>
          <Search
            placeholder="Input a plugin package(npm) name or git address to install"
            onSearch={onSearch}
            enterButton
            size="large"
          />
        </Col>
      </Row>
      <Row gutter={[16, 9]}>
        <Col span={8}>
          <Select allowClear placeholder={"select plugin category"} style={{ width: "100%" }} size={"large"} onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Select allowClear placeholder={"select data type"} style={{ width: "100%" }} size={"large"} onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </Col>
        <Col span={8} style={{display: "flex", alignItems: "center"}}>
          <Text strong style={{fontSize: "18px"}}>{pluginLength} plugins are displayed.</Text>
        </Col>
      </Row>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item
            actions={[<Button type="text" icon={<DeleteOutlined />}>Uninstall</Button>]}
          >
            <List.Item.Meta
              title="@pipcook/plugins-csv-data-collect"
              description={<Space>
                <Tag color="blue">v1.1.0</Tag>
                <Tag color="default">data type: text</Tag>
                <Tag color="default">category: dataCollect</Tag>
              </Space>}
            />
            <div>{`installed at 1个月前`}</div>
          </List.Item>
        )}
      />
    </div>
  );
};

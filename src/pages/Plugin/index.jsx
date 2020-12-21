import React, { useState, useEffect } from "react";
import { Row, Col, Select, Typography, List, Tag, Space, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getPipcook } from 'src/common/service';
import { PLUGINS } from '@pipcook/pipcook-core/dist/constants/plugins';

const { Option } = Select;
const { Text } = Typography;
const pipcook = getPipcook();
const filters = {
  category: undefined,
  datatype: undefined,
};

export default function Plugin() {
  const [plugins, setPlugins] = useState([]);
  const [pluginsToShow, setPluginsToShow] = useState([]);

  // const onSearch = value => console.log(value);
  const filterPluginsToShow = () => {
    setPluginsToShow(
      plugins.filter((plugin) => {
        if (filters.category && filters.category !== plugin.category) {
          return false;
        }
        if (filters.datatype && filters.datatype !== plugin.datatype) {
          return false;
        }
        return true;
      })
    );
  }

  const filterCategory = (category) => {
    filters.category = category;
    filterPluginsToShow();
  }

  const filterDataType = (datatype) => {
    filters.datatype = datatype;
    filterPluginsToShow();
  }

  useEffect(() => {
    (async function () {
      const data = await pipcook.plugin.list();
      setPlugins(data);
      setPluginsToShow(data);
    })()
  }, [])

  return (
    <div className="plugin">
      {/* <Row gutter={[0, 9]}>
        <Col span={24}>
          <Search
            placeholder="Input a plugin package(npm) name or git address to install"
            onSearch={onSearch}
            enterButton
          />
        </Col>
      </Row> */}
      <Row gutter={[16, 9]}>
        <Col span={8}>
          <Select allowClear placeholder={"select plugin category"} style={{ width: "100%" }} onChange={filterCategory}>
            {PLUGINS.map((category) => <Option value={category} key={category}>category: {category}</Option>)}
          </Select>
        </Col>
        <Col span={8}>
          <Select allowClear placeholder={"select data type"} style={{ width: "100%" }} onChange={filterDataType}>
            <Option value="text">data: text</Option>
            <Option value="image">data: image</Option>
          </Select>
        </Col>
        <Col span={8} style={{display: "flex", alignItems: "center"}}>
          <Text strong style={{fontSize: "18px"}}>{pluginsToShow.length} plugins are displayed.</Text>
        </Col>
      </Row>
      <List
        itemLayout="horizontal"
        dataSource={pluginsToShow}
        renderItem={item => (
          <List.Item
            actions={<Button type="text" icon={<DeleteOutlined />}>Uninstall</Button>}
            style={{ paddingBottom: 20 }}
          >
            <List.Item.Meta
              title={item.name}
              description={<Space>
                <Tag color="blue">{item.version}</Tag>
                <Tag color="default">data type: {item.datatype}</Tag>
                <Tag color="default">category: {item.category}</Tag>
              </Space>}
            />
            <div>installed at {item.updatedAt}</div>
          </List.Item>
        )}
      />
    </div>
  );
}

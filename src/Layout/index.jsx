import React from "react";
import { Link } from 'react-router-dom';
import { Layout as AntdLayout, Menu, Button, Divider } from 'antd';
import { SettingOutlined, QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';

import './index.less';

const { Header, Content } = AntdLayout;

export default function Layout(props) {

  const menuClickHandle = (event) => {
    props.history.push(event.key);
  };

  const goSetting = () => {
    props.history.push('/setting');
  };

  const openHelp = () => {
    window.open('https://alibaba.github.io/pipcook');
  };

  return (
    <AntdLayout className="layout">
      <Header className="header">
        <Link to={"/Home"} className="logo">PIPCOOK</Link>
        <Menu
          className="nav"
          mode="horizontal"
          onClick={menuClickHandle}
          defaultSelectedKeys={[props.match.path.match(/^\/\w*/)[0] || 'home']}
        >
          <Menu.Item key="/pipeline">Pipelines</Menu.Item>
          <Menu.Item key="/job">Jobs</Menu.Item>
          <Menu.Item key="/plugin">Plugins</Menu.Item>
        </Menu>
        <div className="operate">
          <Button type="text" style={{ marginRight: '5px' }} icon={<SettingOutlined style={{ fontSize: '22px' }} />} onClick={goSetting} />
          <Button type="text" icon={<QuestionCircleOutlined style={{ fontSize: '22px' }} />} onClick={openHelp} />
          <Divider type="vertical" style={{ marginRight: 0 }} />
          <Button type="text" style={{}} icon={<PlusOutlined />}>New Pipeline</Button>
        </div>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background">
          { props.children }
        </div>
      </Content>
    </AntdLayout>
  );
};

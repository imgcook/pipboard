import React from "react";
import { Layout as AntdLayout } from 'antd';

import './BaseLayout.less';

const { Header, Content } = AntdLayout;

export default function BaseLayout(props) {

  return (
    <AntdLayout className="layout">
      <Header className="header">
        <div to={"/Home"} className="logo">PIPCOOK</div>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background">
          { props.children }
        </div>
      </Content>
    </AntdLayout>
  );
}

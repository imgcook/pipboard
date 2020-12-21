import React from "react";
import { Spin } from 'antd';

export default function Loading() {
  return <Spin
    spinning={true}
    style={{
      width: '100%',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  />;
}

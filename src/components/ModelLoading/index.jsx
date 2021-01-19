import React from 'react';
import { Spin } from 'antd';

import './index.less';

export default function ModelLoading ({loading}) {
  return loading ? <div className="content-loading"><Spin tip="加载模型..." /></div> : null;
}

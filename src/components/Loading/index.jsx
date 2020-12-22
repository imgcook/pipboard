import React from "react";
import { Spin } from 'antd';

import './index.less';

export default function Loading() {
  return <Spin spinning={true} className="spinStyle" />;
}

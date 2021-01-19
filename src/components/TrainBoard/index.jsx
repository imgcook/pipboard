import React, { useState } from 'react';
import { Space, Button, Typography, Tooltip, Divider, Drawer } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

import * as log from '~/common/log';
import Tip from '~/components/Tip';
import { accuracyInfo, lossInfo } from '~/config';

import './index.less';

const { Title, Text } = Typography;

export default function TrainBoard ({visible, close, accChartRender, lossChartRender}) {

  const [placement, setPlacement] = useState('left');

  // switch train data board sides
  const onSwitchSidesHandle = () => {
    placement === 'right' ? setPlacement('left') : setPlacement('right');
  };

  return (
    <Drawer
      title={<Space>
        <Title level={5} style={{marginBottom: 0}}>数据看板</Title>
        <Tooltip title={`切换到${placement === 'right' ? '左边' : '右边'}`}>
          <Button shape="circle" icon={<SwapOutlined />} onClick={onSwitchSidesHandle} />
        </Tooltip>
      </Space>}
      width={400}
      mask={false}
      placement={placement}
      visible={visible}
      onClose={close}
    >
      <p><Text>下方的一些图表可以辅助了解模型的运行状况</Text></p>
      <Divider />
      <div className="data-board-item-title">
        <Text style={{color: '#1890ff'}}>{accuracyInfo.name}</Text>
        <Tip
          title={accuracyInfo.title}
          texts={accuracyInfo.texts}
          onAppear={() => {
            log.exposure('webcamImageClassification', {flow_type: 'train_acc_info_exposure'});
          }}
        />
      </div>
      {accChartRender()}
      <Divider />
      <div className="data-board-item-title">
        <Text style={{color: '#1890ff'}}>{lossInfo.name}</Text>
        <Tip
          title={lossInfo.title}
          texts={lossInfo.texts}
          onAppear={() => {
            log.exposure('webcamImageClassification', {flow_type: 'train_loss_info_exposure'});
          }}
        />
      </div>
      {lossChartRender()}
    </Drawer>
  );
}

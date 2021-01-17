import React from 'react';
import { Space, Button, Typography, Modal } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';

import * as log from '~/common/log';
import Highlighter from '~/components/Highlight';
import { guideList } from '~/config';

import './index.less';

const { Title, Text } = Typography;

export default function ExportModal ({visible, close, exportModel, code}) {

  return (
    <Modal
      title="导出模型在项目中使用"
      centered
      visible={visible}
      footer={null}
      onCancel={close}
      width={1000}
    >
      <div className="export-modal-p">
        <Space>
          <Text>Tensorflow.js 模型：</Text>
          <Button type="primary" icon={<DownloadOutlined />} size="small" onClick={exportModel}>下载模型</Button>
        </Space>
      </div>
      <div className="export-modal-p">
        <Text>使用模型的代码片段：</Text>
        <div className="export-modal-code">
          <Highlighter>{code}</Highlighter>
        </div>
      </div>
      <div className="export-modal-p">
        <Title level={5}>使用 Pipcook</Title>
        <Space direction="vertical">
          {
            guideList.map((item, index) => (
              <Button
                key={index}
                type="link"
                href={item.link}
                onClick={() => {
                  log.click('webcamImageClassification', {flow_type: 'guide_link_btn_click'})
                }}
              >{item.title}</Button>
            ))
          }
        </Space>
      </div>
    </Modal>
  );
}

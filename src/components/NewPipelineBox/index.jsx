import React, { useState } from "react";
import { Modal, Row, Col, Card, Tag, Button } from 'antd';

import { PIPELINE_TEMPLATES } from '~/config/index';
import { pipeline } from '~/common/service';

export default function NewPipelineBox({history, visible, close}) {

  const [chooseIndex, setChooseIndex] = useState(0);
  const [okLoading, setOkLoading] = useState(false);

  const addPipeline = async () => {
    setOkLoading(true);
    const { template } = PIPELINE_TEMPLATES[chooseIndex];
    const pipelineRes = await pipeline.create(template);
    setOkLoading(false);
    if (pipelineRes.id) {
      close();
      history.push(`/pipeline/info?pipelineId=${pipelineRes.id}`);
    }
  };

  return (
    <Modal
      title="Create a new Pipeline"
      centered
      visible={visible}
      onCancel={close}
      footer={[
        <Button key="back" onClick={close}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={okLoading} onClick={addPipeline}>
          Submit
        </Button>,
      ]}
      width={1000}
    >
      <Row gutter={[16, 24]}>
      {
        PIPELINE_TEMPLATES.map(({ title, category, categoryColor, description }, index) => {
          const borderStyle = chooseIndex === index ? { borderColor: "rgba(0, 0, 0, 0.2)" } : {};
          return (
            <Col span={8} key={index}>
              <Card
                hoverable
                size="small"
                title={title}
                style={borderStyle}
                onClick={() => {setChooseIndex(index)}}
                extra={<Tag color={categoryColor}>{category}</Tag>}>
                <p>{description}</p>
              </Card>
            </Col>
          )}
        )
      }
      </Row>
    </Modal>
  );
}

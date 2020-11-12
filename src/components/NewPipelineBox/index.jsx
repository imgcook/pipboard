import React, { Component } from 'react';
import { Button, Box, Card } from '@alifd/next';
import { PIPELINE_TEMPLATES } from '@/utils/config';
import { getPipcook } from '@/utils/common';
import './index.scss';

export default class NewPipelineBox extends Component {

  pipcook = getPipcook()

  state = {
    selected: null,
  }

  async create() {
    const { template } = PIPELINE_TEMPLATES[this.state.selected];
    const pipeline = await this.pipcook.pipeline.create(template);
    this.props.history.push(`/pipeline/info?pipelineId=${pipeline.id}`);
  }

  render() {
    const { setOkBtnEnable } = this.props;
    return <Box direction="row" spacing={20} wrap style={{ width: 1000 }}>
      {PIPELINE_TEMPLATES.map(({ title, category, description }, index) => {
        const cardClassNames = [ 'new-pipeline-card' ];
        if (index === this.state.selected) {
          cardClassNames.push('new-pipeline-card-selected');
        }
        return <Card free key={index} className={cardClassNames.join(' ')} onClick={() => {
          this.setState({ selected: index });
          setOkBtnEnable();
        }}>
          <Card.Header title={title} subTitle={category} />
          <Card.Content>{description}</Card.Content>
          <Card.Actions>
            <Button type="primary" key="action1" text>Documentation</Button>
            <Button type="primary" key="action2" text>Tutorials</Button>
          </Card.Actions>
        </Card>;
      })}
    </Box>;
  }
}

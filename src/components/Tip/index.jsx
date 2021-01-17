import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Space, Tooltip, Typography } from 'antd'

import ApperDiv from '~/components/ApperDiv';

const { Title, Text } = Typography;

const Tip = (props) => {

  return (
    <Tooltip title={<>
      <ApperDiv onAppear={props.onAppear}>
        <Title
          level={5}
          style={{color: '#fff'}}
        >{props.title}</Title>
      </ApperDiv>
      <Space direction="vertical">
        {
          props.texts.map((item, index) => <Text key={index} style={{color: '#fff'}}>{item}</Text>)
        }
      </Space>
    </>}>
      <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
    </Tooltip>
  )
}

export default Tip;

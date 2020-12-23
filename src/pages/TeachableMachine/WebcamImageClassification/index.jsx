import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, Space, Button, Typography, Collapse, List, Tooltip, InputNumber, Select, message } from 'antd'
import { PlusOutlined, VideoCameraOutlined, UploadOutlined, ExportOutlined, QuestionCircleOutlined, CloseOutlined } from '@ant-design/icons';

import './index.less';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const tiainingListConfig = [
  'Epochs',
  'Batch Size',
  'Learning Rate',
  'Reset Defaults',
  'Under the hood',
];

export default function WebcamImageClassification () {

  const videoRef = useRef(null);
  const webcamStream = useRef(null);

  const [data, setData] = useState([{
    imgData: [],
    webcamSwitch: false,
    fileSwitch: false
  }, {
    imgData: [],
    webcamSwitch: false,
    fileSwitch: false
  }])

  useEffect(() => {
    videoRef.current = document.createElement('video');
  }, [])

  const onEpochsChange = (val) => {
    console.log(val);
  }

  const onLearningRateChange = (val) => {
    console.log(val);
  }

  const handleBanchSizeChange = (val) => {
    console.log(val);
  }

  const addDataCard = () => {
    setData(prev => (prev.concat({imgData: [], webcamSwitch: false, fileSwitch: false})));
  }

  const openWebcam = (i) => {
    if (videoRef.current) {
      setData(prev => prev.map((item, index) => index === i ? 
        Object.assign(item, {webcamSwitch: true, fileSwitch: false})
        : Object.assign(item, {webcamSwitch: false, fileSwitch: false})
      ));

      removeVideo();
      document.querySelectorAll('.webcam-data-container')[i].appendChild(videoRef.current);

      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        webcamStream.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
    } else {
      message.warning('Please wait for the video to load');
    }
  }

  const removeVideo = () => {
    if (videoRef.current.parentElement) {
      videoRef.current.parentElement.removeChild(videoRef.current);
    }
  }

  const closeWebcam = (i) => {
    removeVideo();
    webcamStream.current.getTracks().forEach(function(track) {
      track.stop();
    });
    setData(prev => prev.map((item, index) => index === i ? 
      Object.assign(item, {webcamSwitch: false, fileSwitch: false})
      : item
    ));
  }

  const takepicture = (i) => {
    setData(prev => prev.map((item, index) => index === i ? 
      Object.assign(item, {imgData: item.imgData.concat({})})
      : item
    ));
  }

  return (
    <div className="webcamImageClassification">
      <Row gutter={36} align="middle" className="webcam-main">
        {/* data */}
        <Col span={12} className="data-col">
          <Space direction="vertical" size="middle" className="dataList">
            {
              data.map((item, index) => {
                return (
                  <Card
                    hoverable
                    key={index}
                    className="data-card"
                    bodyStyle={{padding: 0}}
                    title={<Title level={5}>Class 1</Title>}
                    extra={<a href="#">More</a>}>
                    <div style={{display: item.webcamSwitch ? 'block' : 'none'}}>
                      <Row>
                        <Col span={12} className="webcam-data-left">
                          <div className="webcam-data-head">
                            <Text className="webcam-data-title">Webcam</Text>
                            <CloseOutlined className="webcam-data-close" onClick={() => {closeWebcam(index)}} />
                          </div>
                          <div className="webcam-data-container" />
                          <Row>
                            <Button type="primary" onClick={() => {takepicture(index)}}>Hold to Record</Button>
                          </Row>
                        </Col>
                        <Col span={12} className="webcam-data-right">
                          <Text>Add Image Samples:</Text>
                          <Row className="webcam-data-canvas">
                            {
                              item.imgData.map((_, index) => (
                                <Col key={index} className="gutter-row" span={6}>
                                  <canvas className="webcam-canvas"></canvas>
                                </Col>
                              ))
                            }
                          </Row>
                        </Col>
                      </Row>
                    </div>
                    <div style={{display: item.webcamSwitch ? 'none' : 'block', padding: '24px'}}>
                      <p>Add Images Samples:</p>
                      <div className="webcam-opts">
                        <button className="webcam-btn" onClick={() => {openWebcam(index)}}>
                          <VideoCameraOutlined style={{fontSize: '24px'}} />
                          <span>Webcam</span>
                        </button>
                        <button className="webcam-btn">
                          <UploadOutlined style={{fontSize: '24px'}} />
                          <span>Upload</span>
                        </button>
                        <div className="webcam-datas">
                          {
                            item.imgData.map((_, index) => (
                              <canvas key={index} className="webcam-canvas"></canvas>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
            }
            <Button type="dashed" size="large" block icon={<PlusOutlined /> } onClick={addDataCard}>Add a class</Button>
          </Space>
        </Col>
        {/* training */}
        <Col span={5}>
          <Card
            hoverable
            style={{ width: '100%' }}
            bodyStyle={{padding: 0}}
            title={
              <Space direction="vertical" style={{width: '100%'}}>
                <Title level={5}>Training</Title>
                <Button type="primary" disabled block>Train Model</Button>
              </Space>
            }
          >
            <Collapse key="collapse" defaultActiveKey={['1']} bordered={false} ghost>
              <Panel header="Advanced" key="1">
                <List
                  dataSource={tiainingListConfig}
                  renderItem={item => {
                    if (item === 'Epochs') {
                      return (<List.Item
                        extra={
                          <Tooltip title="search search search search search">
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Space>
                          <Text strong>{item}:</Text>
                          <InputNumber style={{width: '54px'}} min={1} max={50} defaultValue={3} onChange={onEpochsChange} />
                        </Space>
                      </List.Item>)
                    } else if (item === 'Batch Size') {
                      return (<List.Item
                        extra={
                          <Tooltip title="search search search search search">
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Space style={{width: '100%'}}>
                          <Text strong>{item}:</Text>
                          <Select defaultValue="16" style={{width: '100%'}} onChange={handleBanchSizeChange}>
                            <Option value="16">16</Option>
                            <Option value="32">32</Option>
                            <Option value="64">64</Option>
                            <Option value="128">128</Option>
                            <Option value="256">256</Option>
                            <Option value="512">512</Option>
                          </Select>
                        </Space>
                      </List.Item>)
                    } else if (item === 'Learning Rate') {
                      return (<List.Item
                        extra={
                          <Tooltip title="search search search search search">
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Space style={{width: '100%'}}>
                          <Text strong>{item}:</Text>
                          <InputNumber style={{minWidth: '54px'}} min={0.00001} max={0.99999} defaultValue={0.001} step={0.00001} onChange={onLearningRateChange} />
                        </Space>
                      </List.Item>)
                    } else if (item === 'Reset Defaults') {
                      return (<List.Item
                        extra={
                          <Tooltip title="search search search search search">
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Button block type="text" disabled>{item}</Button>
                      </List.Item>)
                    } else if (item === 'Under the hood') {
                      return (<List.Item
                        extra={
                          <Tooltip title="search search search search search">
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Button block type="text" disabled>{item}</Button>
                      </List.Item>)
                    }
                  }}
                />
              </Panel>
            </Collapse>
          </Card>
        </Col>
        {/* preview */}
        <Col span={7}>
          <Card
            title={<Title level={5}>Preview</Title>}
            hoverable
            extra={<Button type="primary" disabled icon={<ExportOutlined />} >Export Model</Button>}
            style={{ width: '100%' }}>
            <p>You must train a model on the left before you can preview it here.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';
import { Row, Col, Card, Space, Button, Typography, Collapse, List, Tooltip, InputNumber, Select, message, Divider, notification, Spin, Drawer, Modal } from 'antd'
import { PlusOutlined, VideoCameraOutlined, UploadOutlined, ExportOutlined, QuestionCircleOutlined, CloseOutlined, DeleteOutlined, RedoOutlined, BarChartOutlined, SwapOutlined, DownloadOutlined } from '@ant-design/icons';
import * as tf from '@tensorflow/tfjs';

import Highlighter from './components/highlight';
import { mobilenetModelJson } from 'src/config';
import { js } from './common/jstemplate';

import './index.less';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

// data
const initData = [{
  // canvas image data url array
  imgData: [],
  // webcam capture tensor array
  imgDataset: [],
  // class index
  imgClass: 0,
  // class title
  imgClassTitle: 'Class 1',
  // predict status, set true when train model
  isPredict: false,
  // delete status
  isDelete: false,
}, {
  imgData: [],
  imgDataset: [],
  imgClass: 1,
  imgClassTitle: 'Class 2',
  isPredict: false,
  isDelete: false,
}];

// model
const loss = 'categoricalCrossentropy';
const metrics = [ 'accuracy' ];
const hiddenLayerUnits = 10;
const tiainingListConfig = [
  'Epochs',
  'Batch Size',
  'Learning Rate',
  'Reset Defaults',
  'Under the hood',
];

// predict
const classColor = [
  {
    bgColor: '#FFECE2',
    color: '#E67701'
  },
  {
    bgColor: '#FFE9EC',
    color: '#D84C6F'
  },
  {
    bgColor: '#F1F0FF',
    color: '#794AEF'
  },
  {
    bgColor: '#D2E3FC',
    color: '#1967D2'
  },
];

// element
const canvasStyle = {
  width: 224,
  height: 224,
};

// timer
let predictTimer = null;
let takepictureTimer = null;

export default function WebcamImageClassification () {

  // model
  const modelRef = useRef(null);
  const modelPreRef = useRef(null);
  const mobilenetRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // element
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  // train
  const [trainStatus, setTrainStatus] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const trainImgDatasetRef = useRef(null);
  const trainImgClassRef = useRef(null);
  const [epochsVal, setEpochsVal] = useState(50);
  const [batchSizeVal, setBatchSizeVal] = useState(16);
  const [learningRateVal, setLearningRateVal] = useState(0.001);
  const [placement, setPlacement] = useState('left');
  const [dataBoardVisible, setDataBoardVisible] = useState(false);
  const accChartRef = useRef(null);
  const accChartDataRef = useRef([]);
  const accChartInstanceRef = useRef(null);
  const lossChartRef = useRef(null);
  const lossChartDataRef = useRef([]);
  const lossChartInstanceRef = useRef(null);

  // predict
  const [predictStatus, setPredictStatus] = useState(false);
  const [predictResult, setPredictResult] = useState([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // data
  const [data, setData] = useState(initData);
  const dataRef = useRef(data);
  const classRef = useRef(data.length);
  const [webcamSwitchIndex, setWebcamSwitchIndex] = useState(-1);

  // init model
  useEffect(() => {
    const init = async () => {
      modelPreRef.current = tf.sequential();
      mobilenetRef.current = await tf.loadLayersModel(mobilenetModelJson);
      const layer = mobilenetRef.current.getLayer('conv_pw_13_relu');
      const truncatedMobilenet = tf.model({
        inputs: mobilenetRef.current.inputs,
        outputs: layer.output
      });
      for (const _layer of truncatedMobilenet.layers) {
        _layer.trainable = false;
      }
      modelPreRef.current.add(truncatedMobilenet);
      modelPreRef.current.add(tf.layers.flatten({
        inputShape: layer.outputShape.slice(1)
      }));
      modelPreRef.current.add(tf.layers.dense({
        units: hiddenLayerUnits,
        activation: 'relu'
      }));

      videoRef.current = document.createElement('video');
      videoRef.current.width = canvasStyle.width;
      videoRef.current.height = canvasStyle.height;
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = canvasStyle.width;
      canvasRef.current.height = canvasStyle.height;
      setLoading(false);
    };
    init();

    return () => {
      clearTimeout(predictTimer);
      clearTimeout(takepictureTimer);
    }
  }, [])

  // define a model
  const varModel = () => {
    modelRef.current = tf.sequential();
    modelRef.current.add(modelPreRef.current);
    modelRef.current.add(tf.layers.dense({
      units: dataRef.current.length,
      activation: 'softmax'
    }));
    modelRef.current.compile({
      optimizer: tf.train.adam(learningRateVal),
      loss,
      metrics
    });
  }

  // export a model
  const exportModel = async () => {
    const saveResult = await modelRef.current.save('downloads://webcamImageClassification');
    console.log('saveResult', saveResult);
  }

  // train
  // train params epochs
  const onEpochsChange = (val) => {
    setEpochsVal(val);
  }

  // train params banch size
  const onBanchSizeChange = (val) => {
    setBatchSizeVal(val);
  }

  // train params learning rate
  const onLearningRateChange = (val) => {
    setLearningRateVal(val);
  }

  // reset train params
  const resetTrainParams = () => {
    setEpochsVal(50);
    setBatchSizeVal(16);
    setLearningRateVal(0.001);
  }

  // set train status to start train
  const onTrainHandle = () => {
    let imgDataset = [];
    let imgClass = [];
    for (let i = 0; i < dataRef.current.length; i++) {
      const item = dataRef.current[i];
      if (item.imgData.length === 0) {
        notification.warning({
          message: 'Data Warning',
          description: `"${item.imgClassTitle}" requires at least 1 sample. Click "Add Samples" below to begin.`
        });
        return;
      }
    }
    dataRef.current = dataRef.current.map(item => {
      imgDataset = imgDataset.concat(item.imgDataset);
      imgClass = imgClass.concat(new Array(item.imgDataset.length).fill(item.imgClass));
      return Object.assign(item, {
        isPredict: true,
      });
    })
    setData(dataRef.current);
    trainImgDatasetRef.current = imgDataset;
    trainImgClassRef.current = imgClass;
    setTrainStatus(true);
    closeWebcam();
    setDataBoardVisible(true);

    setTimeout(() => {
      trainModel();
    }, 300);
  }

  // define a data board
  const varDataBoard = (name, dom, data, min, max, tick) => {
    const dataBoard = new Chart({
      container: dom,
      autoFit: true,
      height: 240,
    });
    dataBoard.data(data);
    dataBoard.scale({
      data: {
        alias: name,
        tickInterval: tick,
        min: min,
        max: max,
      },
      epoch: {
        alias: 'Epoch',
        nice: true,
        type: 'cat',
      }
    });
    dataBoard.axis('data', { title: {} });
    dataBoard.axis('epoch', { title: {} });
    dataBoard.line().position('epoch*data');
    return dataBoard;
  }

  // start train model
  const trainModel = async () => {
    varModel();
    accChartDataRef.current = [];
    accChartRef.current.innerHTML = null;
    accChartInstanceRef.current = varDataBoard('Accuracy', accChartRef.current, accChartDataRef.current, 0, 1, 0.2);
    accChartInstanceRef.current.render();
    lossChartDataRef.current = [];
    lossChartRef.current.innerHTML = null;
    lossChartInstanceRef.current = varDataBoard('Loss', lossChartRef.current, lossChartDataRef.current, 0, 5, 1);
    lossChartInstanceRef.current.render();
    await modelRef.current.fit(tf.stack(trainImgDatasetRef.current), tf.oneHot(tf.tensor1d(trainImgClassRef.current, 'int32'), dataRef.current.length), {
      epochs: epochsVal,
      batchSize: batchSizeVal,
      verbose: 1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          accChartDataRef.current = accChartDataRef.current.concat([{
            epoch,
            data: logs.acc,
          }]);
          accChartInstanceRef.current.changeData(accChartDataRef.current);
          lossChartDataRef.current = lossChartDataRef.current.concat([{
            epoch,
            data: logs.loss,
          }]);
          lossChartInstanceRef.current.changeData(lossChartDataRef.current);
          setTrainProgress(epoch + 1);
        },
      },
    });
    setPredictStatus(false);
    setTrainStatus(false);
    startPredict();
  }

  // switch train data board sides
  const onSwitchSidesHandle = () => {
    placement === 'right' ? setPlacement('left') : setPlacement('right');
  }

  // predict
  // start predict depend predict status
  useEffect(() => {
    const predictLoop = async () => {
      const img = await webcamRef.current.capture();
      const predictRes = await modelRef.current.predict(tf.stack([img])).array();
      // console.log('predictRes', predictRes[0][0], predictRes[0][1]);
      setPredictResult(predictRes[0]);

      // Dispose the tensor to release the memory.
      img.dispose();
      predictTimer = setTimeout(async () => {
        clearTimeout(predictTimer);
        predictStatus && await predictLoop();
      }, 300);
    }

    (async() => {
      if (predictStatus) {
        document.querySelector('.predict-webcam-container').appendChild(videoRef.current);
        webcamRef.current = await tf.data.webcam(videoRef.current);
        predictLoop();
      }
    })()
    
    return () => {
      clearTimeout(predictTimer);
    }
  }, [predictStatus])

  // set predict status to start predict
  const startPredict = async () => {
    setPredictStatus(true);
  }

  // data
  // class card add
  const addDataCard = () => {
    dataRef.current = dataRef.current.concat({
      imgData: [],
      imgDataset: [],
      imgClass: classRef.current,
      imgClassTitle: `Class ${classRef.current + 1}`,
      isPredict: false,
      isDelete: false,
    });
    setData(dataRef.current);
    classRef.current++;
  }

  // edit card class name
  const onCardClassEdit = (val, index) => {
    console.log(val);
    dataRef.current = dataRef.current.map((item, i) => {
      return i === index ? Object.assign(item, {
        imgClassTitle: val,
      }) : item;
    });
    setData(dataRef.current);
  }

  // delete card
  const onDeleteCardHandle = (i) => {
    dataRef.current[i].imgDataset.map(item => item.dispose());
    dataRef.current = dataRef.current.map((item, index) => i === index ? Object.assign(item, {isDelete: true}) : item);
    setData(dataRef.current);
  }

  // delete img of data
  const delImg = (index, idx) => {
    dataRef.current = dataRef.current.map((item, i) => {
      item.imgDataset.slice(idx, 1)[0].dispose();
      if (i === index) {
        return Object.assign(
          item,
          {
            imgData: item.imgData.slice(0, idx).concat(item.imgData.slice(idx + 1)),
            imgDataset: item.imgDataset.slice(0, idx).concat(item.imgDataset.slice(idx + 1))
          }
        )
      }
      return item;
    });
    setData(dataRef.current);
  }

  // upload
  const onUploadHandle = async (event, index) => {
    let imgData = [];
    let imgDataset = [];
    let len = event.currentTarget.files.length;

    const updateData = () => {
      console.log('imgData', imgData);
      console.log('imgDataset', imgDataset);

      dataRef.current = dataRef.current.map((item, idx) => idx === index ? 
        Object.assign(item, {
          imgData: imgData.concat(item.imgData),
          imgDataset: imgDataset.concat(item.imgDataset),
        }) : item
      );
      console.log('dataref', dataRef.current[index]);
      setData(dataRef.current);
    };

    event.currentTarget.files?.forEach((item) => {
      const src = URL.createObjectURL(item);
      // const image = document.createElement('img');
      const image = new Image();
      image.src = src;
      image.onload = function() {
        console.log('width', this.width);
        console.log('height', this.height);
        image.width = this.width;
        image.height = this.height;
        imgDataset.push(tf.image.resizeBilinear(tf.browser.fromPixels(image), [canvasStyle.width, canvasStyle.height]));
        --len === 0 && updateData();
      }
      imgData.push(src);
    });
    event.target.value = null;
  }

  // webcam
  // open webcam of card
  const openWebcam = async (i) => {
    if (videoRef.current) {
      setWebcamSwitchIndex(i);
      setPredictStatus(false);

      removeVideo();
      document.querySelectorAll('.webcam-data-container')[i].appendChild(videoRef.current);

      webcamRef.current = await tf.data.webcam(videoRef.current);
    } else {
      message.warning('Please wait for the video to load');
    }
  }

  // close webcam
  const closeWebcam = () => {
    removeVideo();
    webcamRef.current.stop();
    setWebcamSwitchIndex(-1);
  }

  // remove video element from parent
  const removeVideo = () => {
    if (videoRef.current.parentElement) {
      videoRef.current.parentElement.removeChild(videoRef.current);
    }
  }

  // take picture when hold button
  const takepicture = async (i) => {
    takepictureTimer = setTimeout(async () => {
      const img = await webcamRef.current.capture();
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasStyle.width, canvasStyle.height);
      const data = canvasRef.current.toDataURL('image/png');
      dataRef.current = dataRef.current.map((item, index) => index === i ? 
        Object.assign(item, {
          imgData: [data].concat(item.imgData),
          imgDataset: [img].concat(item.imgDataset),
        }) : item
      );
      setData(dataRef.current);
      takepicture(i);
    }, 20);
  }

  // stop take picture
  const clearTakepicture = () => {
    clearTimeout(takepictureTimer);
  }

  return (
    <div className="webcamImageClassification">
      <Row gutter={36} align="middle" className="webcam-main">
        { loading ? <div className="content-loading"><Spin tip="Loading Model ..." /></div> : null}
        {/* data */}
        <Col span={12} className="left-col">
          <Space direction="vertical" size="middle" className="dataList">
            {
              data.map((item, index) => {
                return !item.isDelete ? (
                  <Card
                    hoverable
                    key={index}
                    className="data-card"
                    bodyStyle={{padding: 0}}
                    title={<div className="data-card-title">
                      <input
                        className="data-card-title-input"
                        value={item.imgClassTitle}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => onCardClassEdit(e.target.value, index)} />
                    </div>}
                    extra={<Button type="link" onClick={() => {onDeleteCardHandle(index)}}>delete</Button>}>
                    <div style={{display: index === webcamSwitchIndex ? 'block' : 'none'}}>
                      <Row>
                        <Col span={12} className="webcam-data-left">
                          <div className="webcam-data-head">
                            <Text className="webcam-data-title">Webcam</Text>
                            <CloseOutlined className="webcam-data-close" onClick={closeWebcam} />
                          </div>
                          <div className="webcam-data-container" />
                          <Row>
                            <Button
                              type="primary"
                              // touch
                              onTouchStart={() => {takepicture(index)}}
                              onTouchEnd={clearTakepicture}
                              // mouse
                              onMouseDown={() => {takepicture(index)}}
                              onTouchCancel={clearTakepicture}
                              onMouseLeave={clearTakepicture}
                              onMouseOut={clearTakepicture}
                              onMouseUp={clearTakepicture}
                            >Hold to Record</Button>
                          </Row>
                        </Col>
                        <Col span={12} className="webcam-data-right">
                          {
                            item.imgData.length > 0 ?
                            <Text>{item.imgData.length} Images Samples</Text>
                            : <Text>Add Images Samples:</Text>
                          }
                          <div className="webcam-data-canvas">
                            {
                              item.imgData.map((itm, idx) => (
                                <div key={idx} className="webcam-canvas-img-wrap">
                                  <DeleteOutlined className="webcam-canvas-del" onClick={() => delImg(index, idx)} />
                                  <img src={itm} alt="" className="webcam-canvas-img" />
                                </div>
                              ))
                            }
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div style={{display: index === webcamSwitchIndex ? 'none' : 'block', padding: '24px'}}>
                      {
                        item.imgData.length > 0 ?
                        <p>{item.imgData.length} Images Samples</p>
                        : <p>Add Images Samples:</p>
                      }
                      <div className="webcam-opts">
                        <button className="webcam-btn" onClick={() => {openWebcam(index)}}>
                          <VideoCameraOutlined style={{fontSize: '24px'}} />
                          <span>Webcam</span>
                        </button>
                        <button className="webcam-btn">
                          <UploadOutlined style={{fontSize: '24px'}} />
                          <span>Upload</span>
                          <input
                            multiple={true}
                            className="upload-input"
                            type="file" accept="image/jpg, image/jpeg, image/png"
                            onChange={(e) => {onUploadHandle(e, index)}} />
                        </button>
                        <div className="webcam-datas">
                          {
                            item.imgData.map((itm, idx) => (
                              <div key={idx} className="webcam-canvas-img-wrap">
                                <DeleteOutlined className="webcam-canvas-del" onClick={() => delImg(index, idx)} />
                                <img src={itm} alt="" className="webcam-canvas-img" />
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : null;
              })
            }
            <Button type="dashed" size="large" block icon={<PlusOutlined /> } onClick={addDataCard}>Add a class</Button>
          </Space>
        </Col>
        {/* training */}
        <Col span={5}>
          <Card
            hoverable
            className="center-card"
            bodyStyle={{padding: 0}}
            title={
              <Space direction="vertical" style={{width: '100%'}}>
                { trainStatus ? <div className="content-loading">
                  <Spin tip={`Training Model: ${trainProgress} / ${epochsVal}`} />
                </div> : null}
                <Title level={5}>Training</Title>
                <Button
                  block
                  type="primary"
                  disabled={trainStatus}
                  onClick={onTrainHandle}>Train Model</Button>
              </Space>
            }
          >
            <Collapse bordered={false} ghost>
              <Panel header="Advanced" key="1">
                <List
                  dataSource={tiainingListConfig}
                  renderItem={item => {
                    if (item === 'Epochs') {
                      return (<List.Item
                        extra={
                          <Tooltip title={<>
                            <Title level={5} style={{color: '#fff'}}>Epochs</Title>
                            <Space direction="vertical">
                              <Text style={{color: '#fff'}}>One epoch means that each and every sample in the training dataset has been fed through the training model at least once. If your epochs are set to 50, for example, it means that the model you are training will work through the entire training dataset 50 times. Generally the larger the number, the better your model will learn to predict the data.</Text>
                              <Text style={{color: '#fff'}}>You probably want to tweak (usually increase) this number until you get good predictive results with your model.</Text>
                            </Space>
                          </>}>
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Space>
                          <Text strong>{item}:</Text>
                          <InputNumber style={{width: '54px'}} min={1} max={1000} defaultValue={epochsVal} value={epochsVal} onChange={onEpochsChange} />
                        </Space>
                      </List.Item>)
                    } else if (item === 'Batch Size') {
                      return (<List.Item
                        extra={
                          <Tooltip title={<>
                            <Title level={5} style={{color: '#fff'}}>Batch Size</Title>
                            <Space direction="vertical">
                              <Text style={{color: '#fff'}}>A batch is a set of samples used in one iteration of training. For example, let&lsquo;s say that you have 80 images and you choose a batch size of 16. This means the data will be split into 80 / 16 = 5 batches. Once all 5 batches have been fed through the model, exactly one epoch will be complete.</Text>
                              <Text style={{color: '#fff'}}>You probably won&lsquo;t need to tweak this number to get good training results.</Text>
                            </Space>
                          </>}>
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Space style={{width: '100%'}}>
                          <Text strong>{item}:</Text>
                          <Select style={{width: '100%'}} value={batchSizeVal} onChange={onBanchSizeChange}>
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
                          <Tooltip title={<>
                            <Title level={5} style={{color: '#fff'}}>Learning Rate</Title>
                            <Text style={{color: '#fff'}}>Be careful tweaking this number! Even small differences can have huge effects on how well your model learns.</Text>
                          </>}>
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
                          </Tooltip>
                        }>
                        <Space style={{width: '100%'}}>
                          <Text strong>{item}:</Text>
                          <InputNumber style={{minWidth: '54px'}} min={0.00001} max={0.99999} value={learningRateVal} step={0.00001} onChange={onLearningRateChange} />
                        </Space>
                      </List.Item>)
                    } else if (item === 'Reset Defaults') {
                      return (<List.Item>
                        <Button block icon={<RedoOutlined />} onClick={resetTrainParams}>{item}</Button>
                      </List.Item>)
                    } else if (item === 'Under the hood') {
                      return (<List.Item>
                        <Button block icon={<BarChartOutlined />} onClick={() => {setDataBoardVisible(true)}}>{item}</Button>
                      </List.Item>)
                    }
                  }}
                />
              </Panel>
            </Collapse>
          </Card>
        </Col>
        {/* preview */}
        <Col span={7} className="right-col">
          <Card
            title={<Title level={5}>Preview</Title>}
            hoverable
            extra={<Button type="primary" disabled={!predictStatus} icon={<ExportOutlined />} onClick={setExportModalVisible} >Export Model</Button>}
            style={{ width: '100%' }}>
            {
              predictStatus ? <div className="predict-container">
                <div className="predict-webcam-container"></div>
                <Divider />
                <Title level={5}>Output</Title>
                {
                  data.map((item, index) => (item.isPredict && !item.isDelete) ? (<div className="predict-progress-block" key={index}>
                    <Col span={6} style={{padding: 0}}>
                      <Text style={{color: classColor[index % 4].color}}>{item.imgClassTitle}</Text>
                    </Col>
                    <Col span={14}>
                      <div className="predict-progress" style={{backgroundColor: classColor[index % 4].bgColor}}>
                        <div className="predict-progress-line" style={{
                          backgroundColor: classColor[index % 4].color,
                          width: `${Math.floor(predictResult[index] * 100)}%`,
                        }} />
                      </div>
                    </Col>
                    <Col span={4} style={{padding: 0}}><Text>{Math.floor(predictResult[index] * 100)}%</Text></Col>
                  </div>) : null)
                }
              </div> : <p>You must train a model on the left before you can preview it here.</p>
            }
          </Card>
        </Col>
      </Row>
      <Drawer
        title={<Space>
          <Title level={5} style={{marginBottom: 0}}>Under the hood</Title>
          <Tooltip title="Switch sides">
            <Button shape="circle" icon={<SwapOutlined />} onClick={onSwitchSidesHandle} />
          </Tooltip>
        </Space>}
        width={400}
        mask={false}
        placement={placement}
        visible={dataBoardVisible}
        onClose={() => {setDataBoardVisible(false)}}
      >
        <p><Text>Here are a few graphs that can help you understand how well your model is working.</Text></p>
        <p><Text>Don’t worry if this doesn’t make sense at first—you don’t need to use any of this to use Teachable Machine and, in fact, most people don’t :)</Text></p>
        <Divider />
        <div className="data-board-item-title">
          <Text style={{color: '#1890ff'}}>Accuracy per epoch</Text>
          <Tooltip title={<>
            <Title level={5} style={{color: '#fff'}}>Accuracy</Title>
            <Space direction="vertical">
              <Text style={{color: '#fff'}}>Accuracy is the percentage of classifications that a model gets right during training. If your model classifies 70 samples right out of 100, the accuracy is 70 / 100 = 0.7.</Text>
              <Text style={{color: '#fff'}}>If the model&lsquo;s prediction is perfect, the accuracy is one; otherwise, the accuracy is lower than one.</Text>
            </Space>
          </>}>
            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
          </Tooltip>
        </div>
        <div className="data-board-acc-chart" ref={accChartRef}></div>
        <Divider />
        <div className="data-board-item-title">
          <Text style={{color: '#1890ff'}}>Loss per epoch</Text>
          <Tooltip title={<>
            <Title level={5} style={{color: '#fff'}}>Loss</Title>
            <Space direction="vertical">
              <Text style={{color: '#fff'}}>Loss is a measure for evaluating how well a model has learned to predict the right classifications for a given set of samples. If the model&lsquo;s predictions are perfect, the loss is zero; otherwise, the loss is greater than zero.</Text>
              <Text style={{color: '#fff'}}>To get an intuitive sense of what this measures, imagine you have two models: A and B. Model A predicts the right classification for a sample but is only 60% confident of that prediction. Model B also predicts the right classification for the same sample but is 90% confident of that prediction. Both models have the same accuracy, but model B has a lower loss value.</Text>
            </Space>
          </>}>
            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: '20px'}} />
          </Tooltip>
        </div>
        <div className="data-board-loss-chart" ref={lossChartRef}></div>
      </Drawer>
      <Modal
        title="Export your model to use it in projects."
        centered
        visible={exportModalVisible}
        footer={null}
        onCancel={() => setExportModalVisible(false)}
        width={1000}
      >
        <div className="export-modal-p">
          <Space>
            <Text>Tensorflow.js model:</Text>
            <Button type="primary" icon={<DownloadOutlined />} size="small" onClick={exportModel}>Download my model</Button>
          </Space>
        </div>
        <div className="export-modal-p">
          <Text>Code snippets to use your model:</Text>
          <div className="export-modal-code">
            <Highlighter>{js}</Highlighter>
          </div>
        </div>
        <div className="export-modal-p">
          <Title level={5}>使用 Pipcook</Title>
          <Space direction="vertical">
            <Button type="link" href="https://alibaba.github.io/pipcook/#/zh-cn/tutorials/machine-learning-overview">开始机器学习</Button>
            <Button type="link" href="https://alibaba.github.io/pipcook/#/zh-cn/tutorials/component-image-classification">分类图片中的前端组件</Button>
            <Button type="link" href="https://alibaba.github.io/pipcook/#/zh-cn/tutorials/component-object-detection">识别图片中的前端组件</Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
}

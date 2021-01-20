import React, { useState, useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';
import { Row, Col, Card, Space, Button, Typography, Collapse, List, InputNumber, Select, message, Divider, notification, Spin } from 'antd';
import { PlusOutlined, VideoCameraOutlined, UploadOutlined, ExportOutlined, CloseOutlined, DeleteOutlined, RedoOutlined, BarChartOutlined } from '@ant-design/icons';
import * as tf from '@tensorflow/tfjs';

import * as log from '~/common/log';
import Tip from '~/components/Tip';
import TrainBoard from '~/components/TrainBoard';
import ExportModal from '~/components/ExportModal';
import ModelLoading from '~/components/ModelLoading';
import { canvasStyle, initData, modelParams, trainParams, predictClassColor, mobilenetModelJson, trainParamsInit } from '~/config';
import { js } from '~/common/template';

import './index.less';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

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
  const [epochsVal, setEpochsVal] = useState(trainParamsInit.epochsVal);
  const [batchSizeVal, setBatchSizeVal] = useState(trainParamsInit.batchSizeVal);
  const [learningRateVal, setLearningRateVal] = useState(trainParamsInit.learningRateVal);
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
      log.other('webcamImageClassification', {flow_type: 'mobilenet_loading_start'});
      mobilenetRef.current = await tf.loadLayersModel(mobilenetModelJson);
      log.other('webcamImageClassification', {flow_type: 'mobilenet_loading_end'});
      const layer = mobilenetRef.current.getLayer('conv_pw_13_relu');
      const truncatedMobilenet = tf.model({
        inputs: mobilenetRef.current.inputs,
        outputs: layer.output,
      });
      for (const _layer of truncatedMobilenet.layers) {
        _layer.trainable = false;
      }
      modelPreRef.current.add(truncatedMobilenet);
      modelPreRef.current.add(tf.layers.flatten({
        inputShape: layer.outputShape.slice(1),
      }));
      modelPreRef.current.add(tf.layers.dense({
        units: modelParams.hiddenLayerUnits,
        activation: 'relu',
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
    };
  }, []);

  // define a model
  const varModel = () => {
    modelRef.current = tf.sequential();
    modelRef.current.add(modelPreRef.current);
    const units = filterPredictData().length;
    log.other('webcamImageClassification', {flow_type: 'data_class_num', value: units});
    modelRef.current.add(tf.layers.dense({
      units,
      activation: 'softmax',
    }));
    modelRef.current.compile({
      optimizer: tf.train.adam(learningRateVal),
      loss: modelParams.loss,
      metrics: modelParams.metrics,
    });
  };

  // export a model
  const onExportModelHandle = async () => {
    log.click('webcamImageClassification', {flow_type: 'model_download_btn_click'});
    await modelRef.current.save('downloads://model');
  };

  // train
  // train params epochs
  const onEpochsChangeHandle = (val) => {
    log.other('webcamImageClassification', {flow_type: 'train_epoch_change'});
    setEpochsVal(val);
  };

  // train params banch size
  const onBanchSizeChangeHandle = (val) => {
    log.other('webcamImageClassification', {flow_type: 'train_batch_size_change'});
    setBatchSizeVal(parseInt(val));
  };

  // train params learning rate
  const onLearningRateChangeHandle = (val) => {
    log.other('webcamImageClassification', {flow_type: 'train_learning_rate_change'});
    setLearningRateVal(val);
  };

  // reset train params
  const onResetTrainParamsHandle = () => {
    log.click('webcamImageClassification', {flow_type: 'train_reset_click'});
    setEpochsVal(trainParamsInit.epochsVal);
    setBatchSizeVal(trainParamsInit.batchSizeVal);
    setLearningRateVal(trainParamsInit.learningRateVal);
  };

  // open data board
  const onOpenBoardHandle = () => {
    log.click('webcamImageClassification', {flow_type: 'train_open_board_click'});
    setDataBoardVisible(true);
  };

  // set train status to start train
  const onTrainHandle = () => {
    log.click('webcamImageClassification', {flow_type: 'train_btn_click'});
    let imgDataset = [];
    let imgClass = [];
    for (let i = 0; i < dataRef.current.length; i++) {
      const item = dataRef.current[i];
      if (item.imgData.length === 0) {
        notification.warning({
          message: 'Data Warning',
          description: `"${item.imgClassTitle}" requires at least 1 sample. Click "Add Samples" below to begin.`,
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
    });
    setData(dataRef.current);
    trainImgDatasetRef.current = imgDataset;
    trainImgClassRef.current = imgClass;
    setTrainStatus(true);
    onCloseWebcamHandle();
    setDataBoardVisible(true);

    setTimeout(() => {
      trainModel();
    }, 300);
  };

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
      },
    });
    dataBoard.axis('data', { title: {} });
    dataBoard.axis('epoch', { title: {} });
    dataBoard.line().position('epoch*data');
    return dataBoard;
  };

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
    clearTimeout(predictTimer);
    setPredictStatus(false);
    setTrainStatus(false);
    startPredict();
  };

  // predict
  // start predict depend predict status
  useEffect(() => {
    const predictLoop = async () => {
      const img = await webcamRef.current.capture();
      const predictRes = await modelRef.current.predict(tf.stack([img])).array();
      setPredictResult(predictRes[0]);

      // Dispose the tensor to release the memory.
      img.dispose();
      predictTimer = setTimeout(async () => {
        clearTimeout(predictTimer);
        predictStatus && await predictLoop();
      }, 300);
    };

    (async() => {
      if (predictStatus) {
        log.other('webcamImageClassification', {flow_type: 'train_success'});
        document.querySelector('.predict-webcam-container').appendChild(videoRef.current);
        webcamRef.current = await tf.data.webcam(videoRef.current);
        predictLoop();
      }
    })();

    return () => {
      clearTimeout(predictTimer);
    };
  }, [predictStatus]);

  // set predict status to start predict
  const startPredict = async () => {
    setPredictStatus(true);
  };

  // open export modal
  const onOpenExportModalHandle = () => {
    log.click('webcamImageClassification', {flow_type: 'train_open_board_click'});
    setExportModalVisible(true);
  };

  // data
  // class card add
  const onAddDataCardHandle = () => {
    log.click('webcamImageClassification', {flow_type: 'data_card_add_click'});
    dataRef.current = dataRef.current.concat({
      imgData: [],
      imgDataset: [],
      imgClass: classRef.current,
      imgClassTitle: `类别 ${classRef.current + 1}`,
      isPredict: false,
      isDelete: false,
    });
    setData(dataRef.current);
    classRef.current++;
  };

  // filter data by isPredict & isDelete
  const filterPredictData = () => {
    return dataRef.current.filter(item => item.isPredict && !item.isDelete);
  };

  // get class array
  const getClassArray = () => {
    return filterPredictData().map(item => ({
      title: item.imgClassTitle,
    }));
  };

  // edit card class name
  const onCardClassEdit = (val, index) => {
    dataRef.current = dataRef.current.map((item, i) => {
      return i === index ? Object.assign(item, {
        imgClassTitle: val,
      }) : item;
    });
    setData(dataRef.current);
  };

  // delete card
  const onDeleteCardHandle = (i) => {
    log.click('webcamImageClassification', {flow_type: 'data_card_delete_click'});
    dataRef.current[i].imgDataset.map(item => item.dispose());
    dataRef.current = dataRef.current.map((item, index) => i === index ? Object.assign(item, {isDelete: true}) : item);
    setData(dataRef.current);
  };

  // delete img of data
  const onDelImgHandle = (index, idx) => {
    log.click('webcamImageClassification', {flow_type: 'data_picture_delete_click'});
    dataRef.current = dataRef.current.map((item, i) => {
      if (i === index) {
        item.imgDataset.slice(idx, 1)[0].dispose();
        return Object.assign(
          item,
          {
            imgData: item.imgData.slice(0, idx).concat(item.imgData.slice(idx + 1)),
            imgDataset: item.imgDataset.slice(0, idx).concat(item.imgDataset.slice(idx + 1)),
          }
        );
      }
      return item;
    });
    setData(dataRef.current);
  };

  // upload
  const onUploadHandle = async (event, index) => {
    log.click('webcamImageClassification', {flow_type: 'data_upload_btn_click'});
    let imgData = [];
    let imgDataset = [];
    let len = event.currentTarget.files.length;

    const updateData = () => {
      dataRef.current = dataRef.current.map((item, idx) => idx === index ? 
        Object.assign(item, {
          imgData: imgData.concat(item.imgData),
          imgDataset: imgDataset.concat(item.imgDataset),
        }) : item
      );
      setData(dataRef.current);
    };
    
    Array.from(event.currentTarget.files).forEach((item) => {
      const src = URL.createObjectURL(item);
      const image = new Image();
      image.src = src;
      image.onload = function() {
        image.width = this.width;
        image.height = this.height;
        imgDataset.push(tf.image.resizeBilinear(tf.browser.fromPixels(image), [canvasStyle.width, canvasStyle.height]));
        --len === 0 && updateData();
      };
      imgData.push(src);
    });
    event.target.value = null;
  };

  // webcam
  // open webcam of card
  const onOpenWebcamHandle = async (i) => {
    log.click('webcamImageClassification', {flow_type: 'data_webcam_click'});
    if (videoRef.current) {
      setWebcamSwitchIndex(i);
      setPredictStatus(false);

      removeVideo();
      document.querySelectorAll('.webcam-data-container')[i].appendChild(videoRef.current);

      webcamRef.current = await tf.data.webcam(videoRef.current);
    } else {
      message.warning('Please wait for the video to load');
    }
  };

  // close webcam
  const onCloseWebcamHandle = () => {
    log.click('webcamImageClassification', {flow_type: 'data_takepicture_close_click'});
    removeVideo();
    webcamRef.current?.stop && webcamRef.current.stop();
    setWebcamSwitchIndex(-1);
  };

  // remove video element from parent
  const removeVideo = () => {
    if (videoRef.current.parentElement) {
      videoRef.current.parentElement.removeChild(videoRef.current);
    }
  };

  // take picture when hold button
  const onTakepictureHandle = async (i) => {
    log.click('webcamImageClassification', {flow_type: 'data_takepicture_click'});
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
      onTakepictureHandle(i);
    }, 20);
  };

  // stop take picture
  const onClearTakepictureHandle = () => {
    clearTimeout(takepictureTimer);
  };

  console.log('data', data[0].imgClassTitle);

  return (
    <div className="webcamImageClassification">
      <Row gutter={36} align="middle" className="webcam-main">
        <ModelLoading loading={loading} />
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
                    extra={<Button type="link" onClick={() => {onDeleteCardHandle(index);}}>删除</Button>}>
                    <div style={{display: index === webcamSwitchIndex ? 'block' : 'none'}}>
                      <Row>
                        <Col span={12} className="webcam-data-left">
                          <div className="webcam-data-head">
                            <Text className="webcam-data-title">摄像头</Text>
                            <CloseOutlined className="webcam-data-close" onClick={onCloseWebcamHandle} />
                          </div>
                          <div className="webcam-data-container" />
                          <Row>
                            <Button
                              type="primary"
                              // touch
                              onTouchStart={() => {onTakepictureHandle(index);}}
                              onTouchEnd={onClearTakepictureHandle}
                              // mouse
                              onMouseDown={() => {onTakepictureHandle(index);}}
                              onTouchCancel={onClearTakepictureHandle}
                              onMouseLeave={onClearTakepictureHandle}
                              onMouseOut={onClearTakepictureHandle}
                              onMouseUp={onClearTakepictureHandle}
                            >长按拍照</Button>
                          </Row>
                        </Col>
                        <Col span={12} className="webcam-data-right">
                          {
                            item.imgData.length > 0 ?
                            <Text>{item.imgData.length} 张图像样本</Text>
                            : <Text>添加图像样本：</Text>
                          }
                          <div className="webcam-data-canvas">
                            {
                              item.imgData.map((itm, idx) => (
                                <div key={idx} className="webcam-canvas-img-wrap">
                                  <DeleteOutlined className="webcam-canvas-del" onClick={() => onDelImgHandle(index, idx)} />
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
                        <p>{item.imgData.length} 张图像样本</p>
                        : <p>添加图像样本：</p>
                      }
                      <div className="webcam-opts">
                        <button className="webcam-btn" onClick={() => {onOpenWebcamHandle(index);}}>
                          <VideoCameraOutlined style={{fontSize: '24px'}} />
                          <span>摄像头</span>
                        </button>
                        <button className="webcam-btn">
                          <UploadOutlined style={{fontSize: '24px'}} />
                          <span>上传</span>
                          <input
                            multiple={true}
                            className="upload-input"
                            type="file" accept="image/jpg, image/jpeg, image/png"
                            onChange={(e) => {onUploadHandle(e, index);}} />
                        </button>
                        <div className="webcam-datas">
                          {
                            item.imgData.map((itm, idx) => (
                              <div key={idx} className="webcam-canvas-img-wrap">
                                <DeleteOutlined className="webcam-canvas-del" onClick={() => onDelImgHandle(index, idx)} />
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
            <Button type="dashed" size="large" block icon={<PlusOutlined /> } onClick={onAddDataCardHandle}>添加类别</Button>
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
                <Title level={5}>训练</Title>
                <Button
                  block
                  type="primary"
                  disabled={trainStatus}
                  onClick={onTrainHandle}>训练模型</Button>
              </Space>
            }
          >
            <Collapse
              bordered={false}
              ghost
              onChange={() => {
                log.other('webcamImageClassification', {flow_type: 'train_setting_click'});
              }}>
              <Panel header="设置" key="1">
                <List
                  dataSource={trainParams}
                  renderItem={item => {
                    if (item.type === 'Epochs') {
                      return (<List.Item extra={
                        <Tip
                          title={item.type}
                          texts={item.texts}
                          onAppear={() => {
                            log.exposure('webcamImageClassification', {flow_type: 'train_epoch_info_exposure'});
                          }}
                        />
                      }>
                        <Space>
                          <Text strong>{item.title}:</Text>
                          <InputNumber style={{width: '54px'}} min={1} max={1000} defaultValue={epochsVal} value={epochsVal} onChange={onEpochsChangeHandle} />
                        </Space>
                      </List.Item>);
                    } else if (item.type === 'Batch Size') {
                      return (<List.Item extra={
                        <Tip
                          title={item.type}
                          texts={item.texts}
                          onAppear={() => {
                            log.exposure('webcamImageClassification', {flow_type: 'train_batch_size_info_exposure'});
                          }}
                        />
                      }>
                        <Space style={{width: '100%'}}>
                          <Text strong>{item.title}:</Text>
                          <Select style={{width: '100%'}} value={batchSizeVal} onChange={onBanchSizeChangeHandle}>
                            <Option value="16">16</Option>
                            <Option value="32">32</Option>
                            <Option value="64">64</Option>
                            <Option value="128">128</Option>
                            <Option value="256">256</Option>
                            <Option value="512">512</Option>
                          </Select>
                        </Space>
                      </List.Item>);
                    } else if (item.type === 'Learning Rate') {
                      return (<List.Item extra={
                        <Tip
                          title={item.type}
                          texts={item.texts}
                          onAppear={() => {
                            log.exposure('webcamImageClassification', {flow_type: 'train_learning_rate_info_exposure'});
                          }}
                        />
                      }>
                        <Space style={{width: '100%'}}>
                          <Text strong>{item.title}:</Text>
                          <InputNumber style={{minWidth: '54px'}} min={0.00001} max={0.99999} value={learningRateVal} step={0.00001} onChange={onLearningRateChangeHandle} />
                        </Space>
                      </List.Item>);
                    } else if (item.type === 'Reset Defaults') {
                      return (<List.Item>
                        <Button block icon={<RedoOutlined />} onClick={onResetTrainParamsHandle}>{item.title}</Button>
                      </List.Item>);
                    } else if (item.type === 'Under the hood') {
                      return (<List.Item>
                        <Button block icon={<BarChartOutlined />} onClick={onOpenBoardHandle}>{item.title}</Button>
                      </List.Item>);
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
            title={<Title level={5}>预测</Title>}
            hoverable
            extra={<Button type="primary" disabled={!predictStatus} icon={<ExportOutlined />} onClick={onOpenExportModalHandle} >导出模块</Button>}
            style={{ width: '100%' }}>
            {
              predictStatus ? <div className="predict-container">
                <div className="predict-webcam-container"></div>
                <Divider />
                <Title level={5}>结果</Title>
                {
                  data.map((item, index) => (item.isPredict && !item.isDelete) ? (<div className="predict-progress-block" key={index}>
                    <Col span={6} style={{padding: 0}}>
                      <Text style={{color: predictClassColor[index % 4].color}}>{item.imgClassTitle}</Text>
                    </Col>
                    <Col span={14}>
                      <div className="predict-progress" style={{backgroundColor: predictClassColor[index % 4].bgColor}}>
                        <div className="predict-progress-line" style={{
                          backgroundColor: predictClassColor[index % 4].color,
                          width: `${Math.floor(predictResult[index] * 100)}%`,
                        }} />
                      </div>
                    </Col>
                    <Col span={4} style={{padding: 0}}><Text>{Math.floor(predictResult[index] * 100)}%</Text></Col>
                  </div>) : null)
                }
              </div> : <p>需要先在左侧训练一个模型</p>
            }
          </Card>
        </Col>
      </Row>
      <TrainBoard
        visible={dataBoardVisible}
        close={() => {setDataBoardVisible(false);}}
        accChartRender={() => <div className="data-board-acc-chart" ref={accChartRef}></div>}
        lossChartRender={() => <div className="data-board-loss-chart" ref={lossChartRef}></div>}
      />
      <ExportModal
        visible={exportModalVisible}
        close={() => setExportModalVisible(false)}
        exportModel={onExportModelHandle}
        code={js.replace('$ClassLength$', filterPredictData().length).replace('$ClassArray$', JSON.stringify(getClassArray()))}
      />
    </div>
  );
}

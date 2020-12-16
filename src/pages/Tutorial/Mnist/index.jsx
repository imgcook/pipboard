import React, { useEffect, useState, useRef } from "react";
import CanvasDraw from 'react-canvas-draw';
import { Typography, Button, message, Row, Col } from 'antd';
import * as Jimp from 'jimp';
import * as tf from '@tensorflow/tfjs';

import './index.less';

const { Title } = Typography;

export default function Mnist() {

  const [canvasImageBlob, setCanvasImageBlob] = useState(null);
  const [image, setImage] = useState('');
  const modelRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function init() {
      const model = await tf.loadLayersModel('/static/models/mnist/model.json');
      modelRef.current = model;
    }
    init();
  }, [])

  const onChange = async (value) => {
    value.canvas.drawing.toBlob(async (blob) => {
      setCanvasImageBlob(blob);
    });
  }

  useEffect(() => {
    if (canvasImageBlob) {
      predict();
    }
  }, [canvasImageBlob])

  const predict = async () => {
    let img = await Jimp.read(await canvasImageBlob.arrayBuffer());
    img = img.resize(28, 28).invert().greyscale();

    const str = await img.getBase64Async('image/jpeg');
    setImage(str);

    const arr = [];
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        arr.push(Jimp.intToRGBA(img.getPixelColor(j, i)).r / 255);
      }
    }
    const res = modelRef.current.predict(tf.tensor4d(arr, [1, 28, 28, 1]));
    let num = -1;
    let prob = -1;
    const prediction = res.dataSync();
    // TODO NAN
    Object.keys(prediction).forEach((key) => {
      if (prediction[key] > prob) {
        num = parseInt(key, 10);
        prob = prediction[key];
      }
    });
    message.success(`I guess the digit you draw is ${num}, ${Math.floor(prob * 100, 3)}%`);
  }

  const clear = () => {
    canvasRef.current.clear();
  }

  return (
    <div className="mnist">
      <Title level={3}>you can draw a digit here and predict it</Title>
      <Button onClick={clear} style={{marginBottom: 20}}>Clear Canvas</Button>
      <Row gutter={24}>
        <Col span={18}>
          <div className="contents">
            <CanvasDraw 
              ref={canvasRef}
              onChange={onChange}
              canvasWidth={600}
              canvasHeight={600}
              brushColor="#000"
              brushRadius={25}
            />
          </div>
        </Col>
        <Col span={6}>
          {
            image ? <img alt="mnist" height="128" width="128" src={image} className="input-image" /> : null
          }
        </Col>
      </Row>
    </div>
  );
}

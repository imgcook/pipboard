import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import * as Jimp from 'jimp';
import * as tf from '@tensorflow/tfjs';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Typography, Button, message } from 'antd';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

import './index.less';

const { Title } = Typography;

async function createImage(url) {
  const prom = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      // const dataURL = canvas.toDataURL('image/jpeg', 1.0);
      canvas.toBlob(resolve);
    };
    img.src = url;
  });
  const base64 = await prom;
  return base64;
}

const labels = [
  'avator',
  'blured background',
  'icon',
  'label',
  'brand logo',
  'item image',
  'pure background',
  'pure picture',
];

const imageList = [
  {
    url:
      'https://gw.alicdn.com/tfs/TB1ekuMhQY2gK0jSZFgXXc5OFXa-400-400.jpg',
    width: 100,
    height: 100,
  },
  {
    url:
      'https://gw.alicdn.com/tfs/TB1xQqNhNv1gK0jSZFFXXb0sXXa-256-256.jpg',
    width: 100,
    height: 100,
  },
  {
    url:
      'https://gw.alicdn.com/tfs/TB1lV9OhQT2gK0jSZPcXXcKkpXa-200-200.jpg',
    width: 100,
    height: 100,
  },
  {
    url:
      'https://gw.alicdn.com/tfs/TB1vbWJhFY7gK0jSZKzXXaikpXa-400-400.jpg',
    width: 100,
    height: 100,
  },
  {
    url:
      'https://gw.alicdn.com/tfs/TB1WkOLhNn1gK0jSZKPXXXvUXXa-800-800.jpg',
    width: 100,
    height: 100,
  },
  {
    url:
      'https://gw.alicdn.com/tfs/TB1gUaJhKT2gK0jSZFvXXXnFXXa-732-331.jpg',
    width: 100,
    height: 50,
  },
  {
    url:
      'https://gw.alicdn.com/tfs/TB17yuKhUY1gK0jSZFMXXaWcVXa-800-800.jpg',
    width: 100,
    height: 100,
  },
  {
    url:
      'https://img.alicdn.com/tfs/TB1v6gPcQL0gK0jSZFAXXcA9pXa-64-26.png',
    width: 32,
    height: 13,
  },
];

export default function AssetsClassification() {

  const [imageResult, setImageResult] = useState({});
  const modelRef = useRef(null);
  const meansRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const hide = message.loading('loading model from assetsClassification...');
    async function init() {
      const model = await tf.loadGraphModel('/static/models/assetsClassification/model.json');
      const means = (await axios.get('/static/models/assetsClassification/mean.json')).data;
      modelRef.current = model;
      meansRef.current = means;
      hide();
    }
    init();
    return () => {
      hide();
    }
  }, [])

  const onPredict = async (input) => {
    const hide = message.loading('Please give us some time to predict the result ...');
    let img = await Jimp.read(input);
    img = img.resize(256, 256);

    const arr = [];
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {
        arr.push(Jimp.intToRGBA(img.getPixelColor(i, j)).r / 255 - meansRef.current[i][j][0]);
        arr.push(Jimp.intToRGBA(img.getPixelColor(i, j)).g / 255 - meansRef.current[i][j][1]);
        arr.push(Jimp.intToRGBA(img.getPixelColor(i, j)).b / 255 - meansRef.current[i][j][2]);
      }
    }
    const res = modelRef.current.predict(tf.tensor4d(arr, [1, 256, 256, 3]));
    let num = -1;
    let prob = -1;
    const prediction = res.dataSync();
    Object.keys(prediction).forEach((key) => {
      if (prediction[key] > prob) {
        num = parseInt(key, 10);
        prob = prediction[key];
      }
    });
    setImageResult({
      type: labels[num],
      prob,
    });
    hide();
  };

  const onClickImg = async url => {
    const blob = await createImage(url);
    onPredict(await blob.arrayBuffer());
  };

  const onClick = () => {
    inputRef.current.click();
  };

  const onIptChange = async () => {
    const files = inputRef.current.files;
    const ab = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    onPredict(ab);
  };

  return (
    <div className="asset-classification">
      <div className="experienceInner">
        {/* <h3 className="pageTitle">Front-end Assets Classification</h3> */}
        <Title level={3}>Front-end Assets Classification</Title>
        <p className="pageDescription" />
        <div style={{ display: 'flex', flexDirection: 'space-between' }}>
          <div className="content-item">
            {/* <h4 className="label">Origin Image</h4> */}
            <Title level={4}>Origin Image</Title>
            <div className="imageList">
              {imageList.map(item => {
                return (
                  <div
                    key={item.url}
                    className="imageItem"
                    onClick={() => {
                      onClickImg(item.url);
                    }}
                  >
                    <img
                      src={item.url}
                      width={item.width}
                      height={item.height}
                      alt="item"
                    />
                  </div>
                );
              })}
            </div>
            <div className="upload-wrap">
              <span className="upload-btn" onClick={onClick}>
                <input
                  ref={inputRef}
                  onChange={onIptChange}
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  multiple=""
                  style={{ display: 'none' }}
                />
                <Button>Select a Picture</Button>
              </span>
            </div>
          </div>
          <div className="content-item">
            <h4 className="label">Result</h4>
            <CodeMirror
              value={(imageResult && JSON.stringify(imageResult, null, 2)) || ''}
              options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                readOnly: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

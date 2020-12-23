import React from "react";

import Card from 'src/components/Card';
import './index.less';

const items = [{
  title: 'Image Classification for Webcam Assets',
  cover: 'https://gw.alicdn.com/tfs/TB1yujRgUY1gK0jSZFMXXaWcVXa-524-410.png',
  description: 'Use CNN trained by Pipcook to try classify the webcam image assets',
  path: '/teachableMachine/webcam-image-classification',
}];

export default function TeachableMachine(props) {
  return (
    <div className="teachableMachine">
      <Card items = {items} {...props} />
    </div>
  )
}

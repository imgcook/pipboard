import React from 'react';

import Card from 'src/components/Card';
import './index.less';

const items = [{
  title: 'Tutorials',
  cover: 'https://img.alicdn.com/tfs/TB1K3ZQGHj1gK0jSZFuXXcrHpXa-450-240.png',
  description: 'Learn how to get started with Pipcook in tutorials',
  path: '/tutorial',
}, {
  title: 'Teachable Machine',
  cover: 'https://img.alicdn.com/tfs/TB14AUOGNv1gK0jSZFFXXb0sXXa-715-400.jpg',
  description: 'Teachable Machine',
  path: '/teachableMachine',
}];

export default function Home (props) {
  return (
    <div className="home">
      <Card items = {items} {...props} />
    </div>
  );
}

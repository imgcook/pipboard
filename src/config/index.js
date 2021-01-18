export const canvasStyle = {
  width: 224,
  height: 224,
};

export const initData = [{
  // canvas image data url array
  imgData: [],
  // webcam capture tensor array
  imgDataset: [],
  // class index
  imgClass: 0,
  // class title
  imgClassTitle: '类别 1',
  // predict status, set true when train model
  isPredict: false,
  // delete status
  isDelete: false,
}, {
  imgData: [],
  imgDataset: [],
  imgClass: 1,
  imgClassTitle: '类别 2',
  isPredict: false,
  isDelete: false,
}];

export const modelParams = {
  loss: 'categoricalCrossentropy',
  metrics: [ 'accuracy' ],
  hiddenLayerUnits: 10,
};

export const trainParams = [
  {
    type: 'Epochs',
    title: 'Epochs',
    texts: [
      '一个 epoch 意味着训练数据集中的每个样本至少已通过训练模型一次。 例如，将 epoch 设置为 50，则意味着整个训练数据集将在模型中训练 50 次。 通常，数字越大，模型越能更好地预测数据',
      '通常会调整（通常增加）此数字，直到模型获得良好的预测结果为止',
    ],
  },
  {
    type: 'Batch Size',
    title: 'Batch Size',
    texts: [
      '一个 batch 是在一次训练中使用的一组样本。 例如，有80张图像，并且选择的 batch 大小为 16。这意味着数据将被拆分为 80/16 = 5 批。 一旦 5 个批次都通过了模型，就将完成一个 epoch',
      '可能不需要调整此参数即可获得较好的训练效果',
    ],
  },
  {
    type: 'Learning Rate',
    title: 'Learning Rate',
    texts: [
      '谨慎调整这个数字！ 即使很小的差异也会对模型的学习效果产生巨大影响',
    ],
  },
  {
    type: 'Reset Defaults',
    title: '重置参数',
  },
  {
    type: 'Under the hood',
    title: '打开数据看板',
  },
];

export const accuracyInfo = {
  name: 'Accuracy per epoch',
  title: 'Accuracy',
  texts: [
    'Accuracy 是模型在训练过程中得到正确分类的百分比。 如果模型正确预测了 100 个样本中 70 个样本的分类，则 accuracy 为 70/100 = 0.7',
    '如果模型的预测是完美的，则 accuracy 为 1。 否则，accuracy 低于 1',
  ],
};

export const lossInfo = {
  name: 'Loss per epoch',
  title: 'Loss',
  texts: [
    'Loss 是一种评估模型对给定样本集预测正确分类的学习程度的度量。 如果模型的预测是完美的，则 loss 为 0；否则，loss 大于 0',
    '为了直观地了解这种测量的方式，假设有两个模型：A 和 B。模型A 正确预测了样本分类，但对该预测只有 60％ 的信心。 模型B 同样正确预测了样本的分类，但对该预测有 90％ 的信心。 两种模型的 accuracy 相同，但模型B 的 loss 较低',
  ],
};

export const predictClassColor = [
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

export const guideList = [
  {
    title: '开始机器学习',
    link: 'https://alibaba.github.io/pipcook/#/zh-cn/tutorials/machine-learning-overview',
  },
  {
    title: '分类图片中的前端组件',
    link: 'https://alibaba.github.io/pipcook/#/zh-cn/tutorials/component-image-classification',
  },
  {
    title: '识别图片中的前端组件',
    link: 'https://alibaba.github.io/pipcook/#/zh-cn/tutorials/component-object-detection',
  },
];

const devPrefix = 'http://localhost:3000';
const prodPrefix = 'https://cdn.jsdelivr.net/gh/imgcook/pipboard@1.1';
const _mobilenetModelJson = '/static/models/mobilenet/model.json';

// eslint-disable-next-line
export const mobilenetModelJson = process.env.NODE_ENV !== 'production' ? devPrefix + _mobilenetModelJson : prodPrefix + _mobilenetModelJson;

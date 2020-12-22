import ImageClassificationPipeline from './pipelines/image-classification.json';
import ObjectDetectionPipeline from './pipelines/object-detection.json';
import ImageStyleTransferPipeline from './pipelines/image-style-transfer.json';
import TextClassificationPipeline from './pipelines/text-classification.json';
import TextCreationPipeline from './pipelines/text-creation.json';

export const PIPELINE_TEMPLATES = [
  {
    title: "Image Classification",
    category: "vision",
    categoryColor: "cyan",
    description:
      "The image classification accepts the given input images and produces output for identifying whether the type is or not.",
    template: ImageClassificationPipeline,
  },
  {
    title: "Object Detection",
    category: "vision",
    categoryColor: "cyan",
    description:
      "The object detection detects the given objects and returns class and position for each one.",
    template: ObjectDetectionPipeline,
  },
  {
    title: "Image Style Transfer",
    category: "vision",
    categoryColor: "cyan",
    description: "The image style transfer generates an image automatically.",
    template: ImageStyleTransferPipeline,
  },
  {
    title: "Text Classification",
    category: "nlp",
    categoryColor: "geekblue",
    description:
      "The text classification does classify the text to specific classes.",
    template: TextClassificationPipeline,
  },
  {
    title: "Text Creation",
    category: "nlp",
    categoryColor: "geekblue",
    description: "The text creation generates an artwork by a given portfolio.",
    template: TextCreationPipeline,
  },
];

export const DATACOLLECT = 'dataCollect';
export const DATAACCESS = 'dataAccess';
export const DATAPROCESS = 'dataProcess';
export const MODELLOAD = 'modelLoad';
export const MODELDEFINE = 'modelDefine';
export const MODELTRAIN = 'modelTrain';
export const MODELEVALUATE = 'modelEvaluate';

export const PLUGINS = [{
  id: DATACOLLECT,
  title: 'Select a dataset',
}, {
  id: DATAACCESS,
  title: 'Access the dataset',
}, {
  id: DATAPROCESS,
  title: 'Process the sample',
}, {
  id: MODELLOAD,
  title: 'Load a model',
}, {
  id: MODELDEFINE,
  title: 'Define a model',
}, {
  id: MODELTRAIN,
  title: 'Train',
}, {
  id: MODELEVALUATE,
  title: 'Evaluate',
}];

const PLUGIN_LIST = {
  dataCollect: [
    '@pipcook/plugins-csv-data-collect',
    '@pipcook/plugins-image-classification-data-collect',
    '@pipcook/plugins-mnist-data-collect',
    '@pipcook/plugins-object-detection-coco-data-collect',
    '@pipcook/plugins-object-detection-pascalvoc-data-collect',
  ],
  dataAccess: [
    '@pipcook/plugins-coco-data-access',
    '@pipcook/plugins-csv-data-access',
    '@pipcook/plugins-pascalvoc-data-access',
  ],
  dataProcess: [
    '@pipcook/plugins-image-data-process',
  ],
  modelDefine: [
    '@pipcook/plugins-bayesian-model-define',
    '@pipcook/plugins-detectron-fasterrcnn-model-define',
    '@pipcook/plugins-tensorflow-resnet-model-define',
    '@pipcook/plugins-tfjs-mobilenet-model-define',
    '@pipcook/plugins-tfjs-simplecnn-model-define',
  ],
  modelTrain: [
    '@pipcook/plugins-bayesian-model-train',
    '@pipcook/plugins-image-classification-tensorflow-model-train',
    '@pipcook/plugins-image-classification-tfjs-model-train',
    '@pipcook/plugins-object-detection-detectron-model-train',
  ],
  modelEvaluate: [
    '@pipcook/plugins-bayesian-model-evaluate',
    '@pipcook/plugins-image-classification-tensorflow-model-evaluate',
    '@pipcook/plugins-image-classification-tfjs-model-evaluate',
    '@pipcook/plugins-object-detection-detectron-model-evaluate',
  ],
};

const PLUGIN_LOCAL = {
  dataCollect: [
    './packages/plugins/data-collect/csv-data-collect',
    './packages/plugins/data-collect/image-classification-data-collect',
    './packages/plugins/data-collect/mnist-data-collect',
    './packages/plugins/data-collect/object-detection-coco-data-collect',
    './packages/plugins/data-collect/object-detection-pascolvoc-data-collect',
  ],
  dataAccess: [
    './packages/plugins/data-access/coco-data-access',
    './packages/plugins/data-access/csv-data-access',
    './packages/plugins/data-access/pascalvoc-data-access',
  ],
  dataProcess: [
    './packages/plugins/data-process/image-data-process',
  ],
  modelDefine: [
    './packages/plugins/model-define/bayesian-model-define',
    './packages/plugins/model-define/detectron-fasterrcnn-model-define',
    './packages/plugins/model-define/tensorflow-resnet-model-define',
    './packages/plugins/model-define/tfjs-mobilenet-model-define',
    './packages/plugins/model-define/tfjs-simplecnn-model-define',
  ],
  modelTrain: [
    './packages/plugins/model-train/bayesian-model-train',
    './packages/plugins/model-train/image-classification-tensorflow-model-train',
    './packages/plugins/model-train/image-classification-tfjs-model-train',
    './packages/plugins/model-train/object-detection-detectron-model-train',
  ],
  modelEvaluate: [
    './packages/plugins/model-evaluate/bayesian-model-evaluate',
    './packages/plugins/model-evaluate/image-classification-tensorflow-model-evaluate',
    './packages/plugins/model-evaluate/image-classification-tfjs-model-evaluate',
    './packages/plugins/model-evaluate/object-detection-detectron-model-evaluate',
  ],
};

// eslint-disable-next-line
export const pluginList = process.env.DEV === 'true' ? PLUGIN_LOCAL : PLUGIN_LIST;

const devPrefix = 'http://localhost:3000';
const _assetsClassificationModelJsonProduction = '/static/models/assetsClassification/model.json';
const _assetsClassificationMeanJsonProduction = '/static/models/assetsClassification/mean.json';
const _mnistModelJson = '/static/models/mnist/model.json';
// eslint-disable-next-line
export const assetsClassificationModelJson = process.env.DEV === 'true' ? devPrefix + _assetsClassificationModelJsonProduction : _assetsClassificationModelJsonProduction;
// eslint-disable-next-line
export const assetsClassificationMeanJson = process.env.DEV === 'true' ? devPrefix + _assetsClassificationMeanJsonProduction : _assetsClassificationMeanJsonProduction;
// eslint-disable-next-line
export const mnistModelJson = process.env.DEV === 'true' ? devPrefix + _mnistModelJson : _mnistModelJson;

import Mnist from 'src/pages/Tutorial/Mnist';
import AssetsClassification from 'src/pages/Tutorial/AssetsClassification';
import Tutorial from 'src/pages/Tutorial';
import PipelineDetail from 'src/pages/Pipeline/Detail';
import Pipeline from 'src/pages/Pipeline';
import JobDetail from 'src/pages/Job/Detail';
import Job from 'src/pages/Job';
import Plugin from 'src/pages/Plugin';
import Setting from 'src/pages/Setting';
import Home from 'src/pages/Home';

export default {
  '/tutorial': {
    '/mnist': Mnist,
    '/assets-classification': AssetsClassification,
    '/': Tutorial
  },
  '/pipeline': {
    '/info': PipelineDetail,
    '/': Pipeline
  },
  '/job': {
    '/info': JobDetail,
    '/': Job
  },
  '/plugin': {
    '/': Plugin
  },
  '/setting': {
    '/': Setting
  },
  '/': {
    '/': Home
  }
}

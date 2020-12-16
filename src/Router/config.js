import { lazy } from 'react';

export default {
  "/tutorial": {
    "/mnist": lazy(() => import('../pages/Tutorial/Mnist')),
    "/assets-classification": lazy(() => import('../pages/Tutorial/AssetsClassification')),
    "/": lazy(() => import('../pages/Tutorial'))
  },
  "/pipeline": {
    "/info": lazy(() => import('../pages/Pipeline/Detail')),
    "/": lazy(() => import('../pages/Pipeline'))
  },
  "/job": {
    "/info": lazy(() => import('../pages/Job/Detail')),
    "/": lazy(() => import('../pages/Job'))
  },
  "/plugin": {
    "/": lazy(() => import('../pages/Plugin'))
  },
  "/setting": {
    "/": lazy(() => import('../pages/Setting'))
  },
  "/": {
    "/": lazy(() => import('../pages/Home'))
  }
}

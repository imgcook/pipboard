import React, { useState, useEffect } from 'react';
import path from 'path';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Layout from '~/layout';
import routeConfig from './config';
import Home from '~/pages/Home';
import Job from '~/pages/Job';
import JobDetail from '~/pages/Job/Detail';
import Pipeline from '~/pages/Pipeline';
import PipelineDetail from '~/pages/Pipeline/Detail';
import Plugin from '~/pages/Plugin';
import Setting from '~/pages/Setting';
import Tutorial from '~/pages/Tutorial';
import Mnist from '~/pages/Tutorial/Mnist';
import AssetsClassification from '~/pages/Tutorial/AssetsClassification';

async function createRoutes(list) {
  return Promise.all(Object.keys(list).map(routeSetter.bind(null, list)));
}

function switchRoute(name) {
  switch (name) {
    case 'Home':
      return Home;
    case 'Job':
      return Job;
    case 'Pipeline':
      return Pipeline;
    case 'Pipeline/Detail':
      return PipelineDetail;
    case 'Job/Detail':
      return JobDetail;
    case 'Plugin':
      return Plugin;
    case 'Setting':
      return Setting;
    case 'Tutorial':
      return Tutorial;
    case 'Tutorial/Mnist':
      return Mnist;
    case 'Tutorial/AssetsClassification':
      return AssetsClassification;
    default:
      break;
  }
}

async function routeSetter(list, route) {
  const handler = list[route];
  if (typeof handler === 'string') {
    return {
      path: route,
      component: switchRoute(handler),
    };
  } else {
    return {
      path: route,
      component: Layout,
      children: await createRoutes(handler),
    };
  }
}


export default function Router() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    createRoutes(routeConfig).then(res => {
      setRoutes(res);
    })
  }, []);

  return (
    <HashRouter>
      <Switch>
        {routes.map((route, id) => {
          const { component: RouteComponent, children, ...others } = route;
          return (
            <Route
              key={id}
              {...others}
              component={(props) => {
                return (
                  children ? (
                    <RouteComponent key={id} {...props}>
                      <Switch>
                        {children.map((routeChild, idx) => {
                          const { path: childPath, component } = routeChild;
                          return <Route
                            key={`${id}-${idx}`}
                            path={childPath && path.join(route.path, childPath)}
                            component={component}
                          />;
                        })}
                      </Switch>
                    </RouteComponent>
                  ) : <Route key={id} {...route} />
                );
              }}
            />
          );
        })}
      </Switch>
    </HashRouter>
  );
}

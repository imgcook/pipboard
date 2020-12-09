import React, { useState, useEffect } from 'react';
import path from 'path';
import Loadable from 'react-loadable';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Layout from '~/Layout';
import Loading from '~/components/Loading';
import routeConfig from './config';
import Home from '~/pages/Home';
import Job from '~/pages/Job';
import Pipeline from '~/pages/Pipeline';
import Plugin from '~/pages/Plugin';
import Setting from '~/pages/Setting';
import Tutorial from '~/pages/Tutorial';

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
    case 'Plugin':
      return Plugin;
    case 'Setting':
      return Setting;
    case 'Tutorial':
      return Tutorial;
    default:
      break;
  }
}

async function routeSetter(list, route) {
  const handler = list[route];
  if (typeof handler === 'string') {
    // console.log('handler', handler);
    // const LoadableComponent = Loadable({
    //   // loader: () => import(`../pages/${handler}`),
    //   loader: () => import(`../pages/Job`),
    //   loading: Loading,
    // });
    // const m = await import(`../pages/${handler}`);
    // const m = await import(`../pages/Job`);
    // console.log(m);
    return {
      path: route,
      // component: LoadableComponent,
      // component: m?.default ? m.default : m,
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

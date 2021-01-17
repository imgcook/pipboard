import React, { useState, useEffect } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Layout from '~/layout/BaseLayout';
import routeConfig from './config';

function createRoutes(list) {
  return Object.keys(list).map(routeSetter.bind(null, list));
}

function routeSetter(list, route) {
  const handler = list[route];
  if (typeof handler === 'function') {
    return {
      path: route,
      component: handler,
    };
  } else {
    return {
      path: route,
      component: Layout,
      children: createRoutes(handler),
    };
  }
}

export default function Router() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setRoutes(createRoutes(routeConfig));
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
                            path={childPath && route.path + childPath}
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

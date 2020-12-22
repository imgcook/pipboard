import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import path from 'path';

import Layout from '~/layout';
import routeConfig from './config';
import Loading from '~/components/Loading';

function createRoutes(list) {
  return Object.keys(list).map(routeSetter.bind(null, list));
}

function routeSetter(list, route) {
  const handler = list[route];
  if (handler.$$typeof) {
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
      <Suspense fallback={<Layout><Loading /></Layout>}>
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
      </Suspense>
    </HashRouter>
  );
}

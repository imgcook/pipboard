import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React, { Suspense } from 'react';
import path from 'path';
import json from '@/config/routes.json';
import PageLoading from '@/components/PageLoading';
import BasicLayout from '@/layouts/BasicLayout';

async function createRoutes(list) {
  return Promise.all(Object.keys(list).map(routeSetter.bind(null, list)));
};

async function routeSetter(list, route) {
  const handler = list[route];
  if (typeof handler === 'string') {
    const m = await import(`@/pages/${handler}`);
    return {
      path: route, component: m?.default ? m.default : m,
    };
  } else if (typeof handler === 'object') {
    return {
      path: route,
      component: BasicLayout,
      children: await createRoutes(handler),
    };
  }
}

const RouteItem = (props) => {
  const { path: routePath, component, key } = props;
  return (
    <Route
      key={key}
      component={component}
      path={routePath}
    />
  );
};

const router = async () => {
  const routes = await createRoutes(json);
  return (
    <Router>
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
                      <Suspense fallback={<PageLoading />}>
                        <Switch>
                          {children.map((routeChild, idx) => {
                            const { path: childPath, component } = routeChild;
                            return RouteItem({
                              key: `${id}-${idx}`,
                              path: childPath && path.join(route.path, childPath),
                              component,
                            });
                          })}
                        </Switch>
                      </Suspense>
                    </RouteComponent>
                  ) : (
                    <Suspense fallback={<PageLoading />}>
                      {
                        RouteItem({
                          key: id,
                          ...route,
                        })
                      }
                    </Suspense>
                  )
                );
              }}
            />
          );
        })}
      </Switch>
    </Router>
  );
};

export default router;

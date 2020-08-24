import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React, { Suspense } from 'react';
import path from 'path';
import json from '@/config/routes.json';
import PageLoading from '@/components/PageLoading';
import BasicLayout from '@/layouts/BasicLayout';

const createRoutes = (list) => {
  return Object.keys(list).map(routeSetter.bind(null, list));
};

const routeSetter = (list, route) => {
  const handler = list[route];
  if (typeof handler === 'string') {
    const m = require(`@/pages/${handler}`);
    return {
      path: route, component: m?.default ? m.default : m
    };
  } else if (typeof handler === 'object') {
    return {
      path: route,
      component: BasicLayout,
      children: createRoutes(handler)
    };
  }
}

const RouteItem = (props) => {
  const { redirect, path: routePath, component, key } = props;
  if (redirect) {
    return (
      <Redirect
        exact
        key={key}
        from={routePath}
        to={redirect}
      />
    );
  }
  return (
    <Route
      key={key}
      component={component}
      path={routePath}
    />
  );
};

const router = () => {
  const routes = createRoutes(json);
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
                            const { redirect, path: childPath, component } = routeChild;
                            return RouteItem({
                              key: `${id}-${idx}`,
                              redirect,
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

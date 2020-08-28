import { PipcookClient } from '@pipcook/sdk';

export function addUrlParams(arg) {
  location.href = location.href.includes('?') ? `${location.href}&${arg}` : `${location.href}?${arg}`;
}

export function redirect(pathname) {
  location.href = `/index.html#/${pathname.replace(/^\//, '')}`;
}

export function createPluginsFromPipeline(pipeline) {
  return pipeline.plugins.reduce((prev, plugin) => {
    const { id, name, category } = plugin;
    const next = prev;
    next[category] = {
      id,
      name,
      package: plugin,
      params: pipeline[`${category}Params`],
    };
    return next;
  }, {});
}

let pipcookClient;
export function getPipcook() {
  if (!pipcookClient) {
    pipcookClient = new PipcookClient();
  }
  return pipcookClient;
}

import { PipcookClient } from '@pipcook/sdk';

export function createPluginsFromPipeline(pipeline) {
  return pipeline.plugins.reduce((prev, plugin) => {
    const { id, name, category } = plugin;
    const next = prev;
    const params = pipeline[`${category}Params`] ? JSON.parse(pipeline[`${category}Params`]) : {};
    next[category] = {
      id,
      name,
      package: plugin,
      params,
    };
    return next;
  }, {});
}

export function formatPlugins2Update(plugins) {
  return Object.keys(plugins).reduce((prev, pluginKey) => {
    const next = prev;
    next[pluginKey] = plugins[pluginKey] || {};
    next[pluginKey].package = next[pluginKey].package?.name;
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

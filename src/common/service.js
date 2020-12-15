import { PipcookClient } from '@pipcook/sdk';

const PAGE_SIZE = 30;
const pipcook = new PipcookClient();

/**
 * pipeline models
 */
export const pipeline = {
  get: (id) => pipcook.pipeline.get(id),
  list: (currentPage) => pipcook.pipeline.list({offset: (currentPage - 1) * PAGE_SIZE, limit: PAGE_SIZE}),
  create: (param) => pipcook.pipeline.create(param),
  update: (pipelineId, param) => pipcook.pipeline.update(pipelineId, param),
  traceEvent: (traceId, callBack) => pipcook.pipeline.traceEvent(traceId, callBack),
}

/**
 * job models
 */
export const job = {
  get: (id) => pipcook.job.get(id),
  log: (id) => pipcook.job.log(id),
  list: (param) => {
    if (isNaN(Number(param))) {
      return pipcook.job.list(param);
    }
    return pipcook.job.list({offset: (param - 1) * PAGE_SIZE, limit: PAGE_SIZE});
  },
  getOutputDownloadURL: (id) => pipcook.job.getOutputDownloadURL(id),
  traceEvent: (id, callBack) => pipcook.job.traceEvent(id, callBack),
}

/**
 * plugin models
 */
export const plugin = {
  fetch: (id) => pipcook.plugin.fetch(id),
}

/**
 * get client
 */
export const getPipcook = () => pipcook;

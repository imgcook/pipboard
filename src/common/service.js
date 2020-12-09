import { PipcookClient } from '@pipcook/sdk';

const PAGE_SIZE = 30;
const pipcook = new PipcookClient();

export const pipeline = {
  list: (currentPage) => pipcook.pipeline.list({offset: (currentPage - 1) * PAGE_SIZE, limit: PAGE_SIZE}),
}

export const job = {
  list: (currentPage) => pipcook.job.list({offset: (currentPage - 1) * PAGE_SIZE, limit: PAGE_SIZE}),
  getOutputDownloadURL: (id) => pipcook.job.getOutputDownloadURL(id),
}

import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';

const RES_CDN_PREFIX = 'http://ai-sample.oss-cn-hangzhou.aliyuncs.com/pipcook/showcase';

export default async function (req: NowRequest, res: NowResponse) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).send('name is required.');
  }
  const resp = await axios.get(`${RES_CDN_PREFIX}/${name}`, {
    responseType: 'stream'
  });
  resp.data.pipe(res);
}

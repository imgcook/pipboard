import uuid from './uuid';
import url from './url';

const gkey = '/pipcook.pipboard';

/**
 * transform object to string: key=value&key=value
 * @param {object} params {key: value}
 */
const paramsToString = (params = {}) => {
  const urlSearchParams = [];
  for (let k in params) {
    if (k.indexOf('$') === 0) continue;
    urlSearchParams.push(k + '=' + params[k]);
  }
  return urlSearchParams.join('&');
}

/**
 * log func
 * @param {string} key log key
 * @param {string} goKey log gokey
 * @param {string} type log type: EXP/OTHER/CLK
 */
const log = (key, goKey, type) => {
  const params = Object.assign(goKey, {
    uuid: uuid.get(),
    spm: url.get('spm'),
    t: +new Date(),
  });
  window.goldlog?.record && window.goldlog.record(`${gkey}.${key}`, type, paramsToString(params), 'GET');
};

/**
 * exposure log
 * @param {string} key log key
 * @param {object} goKey log params
 */
export const exposure = (key, goKey) => {
  log(key, goKey, 'EXP');
};

/**
 * click log
 * @param {string} key log key
 * @param {object} goKey log params
 */
export const click = (key, goKey) => {
  log(key, goKey, 'CLK');
};

/**
 * other log
 * @param {string} key log key
 * @param {object} goKey log params
 */
export const other = (key, goKey) => {
  log(key, goKey, 'OTHER');
};

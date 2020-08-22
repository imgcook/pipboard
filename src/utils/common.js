import { PipcookClient } from '@pipcook/sdk';

export function addUrlParams(arg) {
  location.href = location.href.includes('?') ? `${location.href}&${arg}` : `${location.href}?${arg}`;
}

let __pipcookClient;
export function getPipcook() {
  if (!__pipcookClient) {
    __pipcookClient = new PipcookClient();
  }
  return __pipcookClient;
}

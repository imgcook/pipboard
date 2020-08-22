import { PipcookClient } from '@pipcook/sdk';

export function addUrlParams(arg) {
  location.href = location.href.includes('?') ? `${location.href}&${arg}` : `${location.href}?${arg}`;
}

let pipcookClient;
export function getPipcook() {
  if (!pipcookClient) {
    pipcookClient = new PipcookClient();
  }
  return __pipcookClient;
}

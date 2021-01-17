class UUID {
  constructor(len, radix) {
    this.chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    this.LocalStorageKey = '__uuid';
    this.uuid = localStorage.getItem(this.LocalStorageKey) || [];
    if (!Array.isArray(this.uuid)) return;
    radix = radix || this.chars.length;
    if (len) {
      // Compact form
      for (let i = 0; i < len; i++) this.uuid[i] = this.chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      let r;
      // rfc4122 requires these characters
      this.uuid[8] = this.uuid[13] = this.uuid[18] = this.uuid[23] = '-';
      this.uuid[14] = '4';
      // Fill in random data. At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (let i = 0; i < 36; i++) {
        if (!this.uuid[i]) {
          r = 0 | Math.random()*16;
          this.uuid[i] = this.chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    this.uuid = this.uuid.join('');
  }
  get() {
    return this.uuid;
  }
}

export default new UUID();

class URL {
  constructor() {
    const hrefsplit = location.href.split('?');
    this.params = {};
    if (hrefsplit.length > 1) {
      hrefsplit[1].split('&').forEach((item) => {
        const query = item.split('=');
        query.length === 2 && (this.params[query[0]] = query[1]);
      })
    }
  }
  get(key) {
    return this.params[key];
  }
}

export default new URL();

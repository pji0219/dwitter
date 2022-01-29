export default class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetch(url, option) {
    const res = await fetch(`${this.baseUrl}${url}`, {
      ...option,
      headers: {
        'Content-Type': 'application/json',
        ...option.headers
      }
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error(error);
    }

    if (res.status > 299 || res.status < 200) {
      const message =
      data && data.message ? data.message : 'something went wrong'
    }
    return data;
  }
}
import QRequestBuilder from './RequestData';

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const DEL = 'DELETE';

export const TYPE_FORM = 'application/x-www-form-urlencoded';
export const TYPE_JSON = 'application/json';

/** @typedef {import('./RequestData').PublicProperties} QRequest */
/** @typedef {import('./RequestData').Options} qRequestOptions */

/** @typedef {queueOptions} QueueOptions */

const queueOptions = {
  /** @type {number} - Delay in milliseconds, when there's a connection error */
  retryDelay: 10000,
};

export default class xhrQ {
  /**
   * @param {QueueOptions} options
   */
  constructor(options) {
    this.options = Object.assign({}, queueOptions, options);

    /* Keep track of whether Ajax calls are still processing. */
    this.working = false;

    /* Always recheck for any pending ajax calls. This stores the Timeout */
    this.reDispatch = setInterval(this.dispatch, 10000);


    /** @type {Object.<string, QRequest>} */
    this.queue = {};
  }

  /**
   * Append a new ajax request to the end of the queue.
   * @param {string} url
   * @param {string|FormData|Object.<string, any>} data
   * @param {qRequestOptions} [options]
   * @returns {QRequest}
   */
  push(url, data, options) {
    window.addEventListener('onbeforeunload', this.getIncompleteAlert);

    const request = QRequestBuilder(
      url,
      data,
      options
    );

    this.queue[request.getId()] = request;

    this.dispatch();
    return request;
  }

  /**
   * Append a new ajax request to the end of the queue.
   * @param {QRequest} request
   * @returns {QRequest}
   */
  pushRequest(request) {
    this.queue[request.getId()] = request;

    this.dispatch();
    return request;
  }

  /**
   * @param {string} requestId
   * @throws
   */
  abort(requestId) {
    if (requestId in this.queue) {
      this.queue[requestId].abort();
      delete this.queue[requestId];
    } else {
      throw `Tried to abort Ajax call. ID (${requestId}) does not exist.`;
    }
  }

  dispatch() {
    const queue = Object.keys(this.queue);

    if (this.working === false && queue.length > 0) {
      this.working = true;
      this.ajaxPacket(this.queue[queue[0]]);
    } else if (this.working === false && queue.length === 0) {
      this.disableUnloadListener();
    }
  }

  /**
   * @param {QRequest} request
   * @returns
   */
  ajaxPacket(request) {
    const { id, data, url, method, timeout, success, failure } = request.getPacket();

    const xhr = new XMLHttpRequest();
    xhr.timeout = timeout;

    switch (method) {
      case POST:
        sendPost(xhr, url, data);
        break;
      case PUT: // ToDo Add function
        break;
      case DEL: // ToDo Add function
        break;
      case GET:
      default:
        sendGet(xhr, url, data);
    }

    xhr.onload = () => {
      delete this.queue[id];
      success(xhr.response);
      this.working = false;
    };

    xhr.ontimeout = () => {
      setTimeout(() => {
        this.ajaxPacket(request);
      }, this.options.retryDelay);
    };

    xhr.onabort = () => {
      delete this.queue[id];
      this.working = false;
    };

    xhr.onerror = () => {
      if (xhr.readyState == 0) {
        // There's a connection error. Either no internet, or connection refused. Try again
        setTimeout(() => {
            // Check if the ajaxID is still in the queue, may have been aborted
            if (id in this.queue) {
                this.queue[id].req = this.ajaxPacket(request);
            } else {
                this.dispatch();
            }
        }, this.options.retryDelay);
      } else {
        delete this.queue[id];
        failure(xhr, xhr.statusText, xhr.status);
        this.working = false;
        this.dispatch();
      }
    };

    return xhr;
  }

  disableUnloadListener() {
    window.removeEventListener('beforeunload', this.getIncompleteAlert);
  }

  getIncompleteAlert() {
    return 'You have items still processing.\nLeaving will discard unsent data.\nAre you sure you want to leave?';
  }
}

/**
 * Checks whether the provided string is a valid representation of JSON
 * @param {string} testString
 * @returns {boolean}
 */
export function isJsonString(testString) {
  if (typeof testString !== "string") {
    return false;
  }
  try {
    JSON.parse(testString);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * @param {XMLHttpRequest} xmlHttpRequest
 * @param {string} url
 * @param {string|FormData|Object.<string, any>} data
 * @return {XMLHttpRequest}
 */
function sendPost(xmlHttpRequest, url, data) {
  const xhr = xmlHttpRequest;

  let dataPacket;
  let contentType = null;

  if (typeof data === 'string') {
    dataPacket = data;

    if (isJsonString(data)) {
      contentType = TYPE_JSON;
    }
  } else if (data instanceof FormData) {
    dataPacket = data;
  } else if (typeof data === 'object') {
    try {
      dataPacket = JSON.stringify(data);
      contentType = TYPE_JSON;
    } catch (error) {
      throw `Could not convert data into JSON\n${data}`;
    }
  } else {
    throw `Data did not match any of the required types (string|FormData|Object.<string, any>)\n${data}`;
  }

  if (contentType !== null) {
    const charSet = document.characterSet || 'UTF-8';
    xhr.setRequestHeader('Content-Type', `${contentType};charset=${charSet}`);
  }

  xhr.open(POST, url);
  xhr.send(dataPacket);

  return xhr;
}

/**
 * @param {XMLHttpRequest} xmlHttpRequest
 * @param {string} url
 * @param {string|Object.<string, any>} data
 * @return {XMLHttpRequest}
 */
function sendGet(xmlHttpRequest, url, data) {
  const xhr = xmlHttpRequest;

  let query = [];

  if (typeof data === 'string') {
    query.push(data);
  } else if (typeof data === 'object') {
    Object.keys(data).map((key) => {
      const queryKey = encodeURIComponent(key);
      const queryValue = encodeURIComponent(data[key]);
      query.push(`${queryKey}=${queryValue}`);
    });
  } else {
    throw `Data did not match any of the required types (string|Object.<string, any>)\n${data}`;
  }

  xhr.open(GET, `${url}?${query.join('&')}`);
  xhr.send();

  return xhr;
}

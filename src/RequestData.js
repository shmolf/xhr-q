
/**
 * @typedef {Object} Options
 * @property {'GET'|'POST'|'PUT'|'DELETE'} [method]
 * @property {((xhr: XMLHttpRequest) => void)} [success]
 * @property {((xhr: XMLHttpRequest, statusText: string, status: number) => void)} [failure]
 * @property {Number} [timeout=15000]
 */

/** @type {Options} */
const defaultOptions = {
  method: 'GET',
  success,
  failure,
  timeout: 15000,
};

// I think this is a bug, to reference qRequest this way. See @typedef of 'qRequest' w/in the function
/** @typedef {qRequest} PublicProperties */

/**
 * @param {string} url
 * @param {Object} data
 * @param {Options} [options]
 * @returns {qRequest}
 */
export default function qRequest(url, data, options) {
  /** @type {Options} */
  const opt = Object.assign({}, defaultOptions, options);

  const method = opt.method;
  const id = Date.now() + String(Math.random());
  const success = opt.success;
  const failure = opt.failure;
  /** @type {XMLHttpRequest|null} */
  const xhr = null;

  /**
   * @returns {RequestConfig}
   */
  function getPacket() {
    /** @typedef {packet} RequestConfig */
    const packet = {
      id: self.privateProperties.id,
      method: self.privateProperties.method,
      url: self.privateProperties.url,
      data: self.privateProperties.data,
      success: self.privateProperties.success,
      failure: self.privateProperties.failure,
      timeout: self.privateProperties.timeout,
    };

    return packet;
  }

  /**
   * @returns {string}
   */
  function getId() {
    return self.privateProperties.id;
  }

  /**
   * @returns {?XMLHttpRequest}
   */
  function getRequest() {
    return self.privateProperties.xhr;
  }

  /**
   * @param {?XMLHttpRequest} xmlRequest
   */
  function setRequest(xmlRequest) {
    const xhr = xmlRequest;
    xhr.onload = () => self.privateProperties.success(xhr);
    xhr.onerror = () => self.privateProperties.failure(xhr, xhr.statusText, xhr.status);

    self.privateProperties.xhr = xhr;
  }

  /**
   * @returns {void}
   */
  function abort() {
    if (self.privateProperties.xhr instanceof XMLHttpRequest) {
      self.privateProperties.xhr.abort();
      self.privateProperties.xhr = null;
    }
  }

  /**
   * I think this is a hacky/buggy way to specify the return type, using the function's name.
   * @typedef {publicProperties} qRequest
   */

  /**
   * @member
   */
  const publicProperties = {
    getId,
    getPacket,
    getRequest,
    setRequest,
    abort,
  };

  const self = {
    publicProperties,
    privateProperties: {
      method,
      id,
      url,
      data,
      success,
      failure,
      xhr,
    },
    staticProperties: {},
  };

  return self.publicProperties;
}

/**
 * @param {XMLHttpRequest} xhr
 */
export function success(xhr) {}

/**
 * @interface FailureCall
 * @param {XMLHttpRequest} xhr
 * @param {string} statusText
 * @param {number} status
 */
 export function failure(xhr, statusText, status) {}

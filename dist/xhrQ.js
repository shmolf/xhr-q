(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["xhrQ"] = factory();
	else
		root["xhrQ"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ xhrQ; }
});

// UNUSED EXPORTS: DEL, GET, POST, PUT, TYPE_FORM, TYPE_JSON, isJsonString

;// CONCATENATED MODULE: ./src/RequestData.js
/**
 * @typedef {Object} Options
 * @property {'GET'|'POST'|'PUT'|'DELETE'} [method]
 * @property {((xhr: XMLHttpRequest) => void)} [success]
 * @property {((xhr: XMLHttpRequest, statusText: string, status: number) => void)} [failure]
 * @property {Number} [timeout=15000]
 */

/** @type {Options} */
var defaultOptions = {
  method: 'GET',
  success: success,
  failure: failure,
  timeout: 15000
}; // I think this is a bug, to reference qRequest this way. See @typedef of 'qRequest' w/in the function

/** @typedef {qRequest} PublicProperties */

/**
 * @param {string} url
 * @param {Object} data
 * @param {Options} [options]
 * @returns {qRequest}
 */

function qRequest(url, data, options) {
  /** @type {Options} */
  var opt = Object.assign({}, defaultOptions, options);
  var method = opt.method;
  var id = Date.now() + String(Math.random());
  var success = opt.success;
  var failure = opt.failure;
  /** @type {XMLHttpRequest|null} */

  var xhr = null;
  /**
   * @returns {RequestConfig}
   */

  function getPacket() {
    /** @typedef {packet} RequestConfig */
    var packet = {
      id: self.privateProperties.id,
      method: self.privateProperties.method,
      url: self.privateProperties.url,
      data: self.privateProperties.data,
      success: self.privateProperties.success,
      failure: self.privateProperties.failure,
      timeout: self.privateProperties.timeout
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
    var xhr = xmlRequest;

    xhr.onload = function () {
      return self.privateProperties.success(xhr);
    };

    xhr.onerror = function () {
      return self.privateProperties.failure(xhr, xhr.statusText, xhr.status);
    };

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


  var publicProperties = {
    getId: getId,
    getPacket: getPacket,
    getRequest: getRequest,
    setRequest: setRequest,
    abort: abort
  };
  var self = {
    publicProperties: publicProperties,
    privateProperties: {
      method: method,
      id: id,
      url: url,
      data: data,
      success: success,
      failure: failure,
      xhr: xhr
    },
    staticProperties: {}
  };
  return self.publicProperties;
}
/**
 * @param {XMLHttpRequest} xhr
 */

function success(xhr) {}
/**
 * @interface FailureCall
 * @param {XMLHttpRequest} xhr
 * @param {string} statusText
 * @param {number} status
 */

function failure(xhr, statusText, status) {}
;// CONCATENATED MODULE: ./src/xhrQ.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var GET = 'GET';
var POST = 'POST';
var PUT = 'PUT';
var DEL = 'DELETE';
var TYPE_FORM = 'application/x-www-form-urlencoded';
var TYPE_JSON = 'application/json';
/** @typedef {import('./RequestData').PublicProperties} QRequest */

/** @typedef {import('./RequestData').Options} qRequestOptions */

/**
 * @typedef {Object} QueueOptions
 * @property {number} [retryDelay] - Delay in milliseconds, when there's a connection error
 */

/** @type {QueueOptions} */

var queueOptions = {
  retryDelay: 10000
};

var xhrQ = /*#__PURE__*/function () {
  /**
   * @param {QueueOptions} [options]
   */
  function xhrQ(options) {
    _classCallCheck(this, xhrQ);

    this.options = Object.assign({}, queueOptions, options || {});
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


  _createClass(xhrQ, [{
    key: "push",
    value: function push(url, data, options) {
      window.addEventListener('onbeforeunload', this.getIncompleteAlert);
      var request = qRequest(url, data, options);
      this.queue[request.getId()] = request;
      this.dispatch();
      return request;
    }
    /**
     * Append a new ajax request to the end of the queue.
     * @param {QRequest} request
     * @returns {QRequest}
     */

  }, {
    key: "pushRequest",
    value: function pushRequest(request) {
      this.queue[request.getId()] = request;
      this.dispatch();
      return request;
    }
    /**
     * @param {string} requestId
     * @throws
     */

  }, {
    key: "abort",
    value: function abort(requestId) {
      if (requestId in this.queue) {
        this.queue[requestId].abort();
        delete this.queue[requestId];
      } else {
        throw "Tried to abort Ajax call. ID (".concat(requestId, ") does not exist.");
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch() {
      var queue = Object.keys(this.queue);

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

  }, {
    key: "ajaxPacket",
    value: function ajaxPacket(request) {
      var _this = this;

      var _request$getPacket = request.getPacket(),
          id = _request$getPacket.id,
          data = _request$getPacket.data,
          url = _request$getPacket.url,
          method = _request$getPacket.method,
          timeout = _request$getPacket.timeout,
          success = _request$getPacket.success,
          failure = _request$getPacket.failure;

      var xhr = new XMLHttpRequest();
      xhr.timeout = timeout;

      switch (method) {
        case POST:
          sendPost(xhr, url, data);
          break;

        case PUT:
          // ToDo Add function
          break;

        case DEL:
          // ToDo Add function
          break;

        case GET:
        default:
          sendGet(xhr, url, data);
      }

      xhr.onload = function () {
        delete _this.queue[id];
        success(xhr);
        _this.working = false;
      };

      xhr.ontimeout = function () {
        setTimeout(function () {
          _this.ajaxPacket(request);
        }, _this.options.retryDelay);
      };

      xhr.onabort = function () {
        delete _this.queue[id];
        _this.working = false;
      };

      xhr.onerror = function () {
        if (xhr.readyState == 0) {
          // There's a connection error. Either no internet, or connection refused. Try again
          setTimeout(function () {
            // Check if the ajaxID is still in the queue, may have been aborted
            if (id in _this.queue) {
              _this.queue[id].req = _this.ajaxPacket(request);
            } else {
              _this.dispatch();
            }
          }, _this.options.retryDelay);
        } else {
          delete _this.queue[id];
          failure(xhr, xhr.statusText, xhr.status);
          _this.working = false;

          _this.dispatch();
        }
      };

      return xhr;
    }
  }, {
    key: "disableUnloadListener",
    value: function disableUnloadListener() {
      window.removeEventListener('beforeunload', this.getIncompleteAlert);
    }
  }, {
    key: "getIncompleteAlert",
    value: function getIncompleteAlert() {
      return 'You have items still processing.\nLeaving will discard unsent data.\nAre you sure you want to leave?';
    }
  }]);

  return xhrQ;
}();
/**
 * Checks whether the provided string is a valid representation of JSON
 * @param {string} testString
 * @returns {boolean}
 */



function isJsonString(testString) {
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
  var xhr = xmlHttpRequest;
  var dataPacket;
  var contentType = null;

  if (typeof data === 'string') {
    dataPacket = data;

    if (isJsonString(data)) {
      contentType = TYPE_JSON;
    }
  } else if (data instanceof FormData) {
    dataPacket = data;
  } else if (_typeof(data) === 'object') {
    try {
      dataPacket = JSON.stringify(data);
      contentType = TYPE_JSON;
    } catch (error) {
      throw "Could not convert data into JSON\n".concat(data);
    }
  } else {
    throw "Data did not match any of the required types (string|FormData|Object.<string, any>)\n".concat(data);
  }

  if (contentType !== null) {
    var charSet = document.characterSet || 'UTF-8';
    xhr.setRequestHeader('Content-Type', "".concat(contentType, ";charset=").concat(charSet));
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
  var xhr = xmlHttpRequest;
  var query = [];

  if (typeof data === 'string') {
    query.push(data);
  } else if (_typeof(data) === 'object') {
    Object.keys(data).map(function (key) {
      var queryKey = encodeURIComponent(key);
      var queryValue = encodeURIComponent(data[key]);
      query.push("".concat(queryKey, "=").concat(queryValue));
    });
  } else {
    throw "Data did not match any of the required types (string|Object.<string, any>)\n".concat(data);
  }

  xhr.open(GET, "".concat(url, "?").concat(query.join('&')));
  xhr.send();
  return xhr;
}
__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
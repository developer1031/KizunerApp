"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _asyncStorage = _interopRequireDefault(require("@react-native-community/async-storage"));

var _constants = require("../utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var call;

var once = function once() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (call) {
    call.cancel('only one request allowed at a time');
  }

  call = _axios["default"].CancelToken.source();
  config.cancelToken = call.token;
  return (0, _axios["default"])(config);
};

var _callee = function _callee(_ref) {
  var _ref$method, method, _ref$endpoint, endpoint, data, _ref$headers, headers, _ref$params, params, _ref$useOnce, useOnce, token, axiost;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref$method = _ref.method, method = _ref$method === void 0 ? 'GET' : _ref$method, _ref$endpoint = _ref.endpoint, endpoint = _ref$endpoint === void 0 ? '/' : _ref$endpoint, data = _ref.data, _ref$headers = _ref.headers, headers = _ref$headers === void 0 ? {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          } : _ref$headers, _ref$params = _ref.params, params = _ref$params === void 0 ? {} : _ref$params, _ref$useOnce = _ref.useOnce, useOnce = _ref$useOnce === void 0 ? false : _ref$useOnce;
          _context.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem(_constants.USER_TOKEN_KEY));

        case 3:
          token = _context.sent;
          axiost = useOnce ? once : _axios["default"];
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(axiost({
            method: method,
            url: _constants.API_URL + endpoint,
            data: data,
            params: params,
            headers: token && token.length ? _objectSpread({
              Authorization: "Bearer ".concat(token)
            }, headers) : headers,
            validateStatus: function validateStatus(status) {
              return true;
            }
          }));

        case 8:
          return _context.abrupt("return", _context.sent);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](5);
          console.log(_context.t0);
          return _context.abrupt("return", {
            status: 500,
            message: _context.t0.message || 'Something went wrong'
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 11]]);
};

exports["default"] = _callee;
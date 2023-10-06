"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactNative = require("react-native");

var _responsive = require("~utils/responsive");

var _default = _reactNative.StyleSheet.create({
  buttonContainer: {
    width: _responsive.getSize.w(80),
    height: _responsive.getSize.h(80),
    borderRadius: _responsive.getSize.w(40),
    backgroundColor: '#D91E18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'white'
  },
  circleInside: {
    width: _responsive.getSize.w(60),
    height: _responsive.getSize.h(60),
    borderRadius: _responsive.getSize.w(30),
    backgroundColor: '#D91E18'
  },
  buttonStopContainer: {
    backgroundColor: 'transparent'
  },
  buttonStop: {
    backgroundColor: '#D91E18',
    width: _responsive.getSize.w(40),
    height: _responsive.getSize.h(40),
    borderRadius: 3
  }
});

exports["default"] = _default;
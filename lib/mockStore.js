'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockStore = function () {
  function MockStore() {
    _classCallCheck(this, MockStore);

    this.reset();
    this.mockDispatch = this.mockDispatch.bind(this);
  }

  _createClass(MockStore, [{
    key: 'reset',
    value: function reset() {
      this.state = {};
      this.actions = [];
    }
  }, {
    key: 'setState',
    value: function setState(newState) {
      this.state = newState;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: 'dispatchSync',
    value: function dispatchSync(action) {
      var done = false;
      var result = void 0;
      action(this.mockDispatch, this.getState).then(function (r) {
        result = r;
        done = true;
      });
      require('deasync').loopWhile(function () {
        return !done;
      });
      //require('deasync').sleep(100);
      return result;
    }
  }, {
    key: 'dispatch',
    value: function dispatch(action) {
      return action();
    }
  }, {
    key: 'mockDispatch',
    value: function mockDispatch(action) {
      if (_lodash2.default.isFunction(action)) {
        this.actions = [].concat(_toConsumableArray(this.actions), [action.name]);
      } else if (_lodash2.default.has(action, 'type')) {
        this.actions = [].concat(_toConsumableArray(this.actions), [action]);
      } else {
        throw 'Unsupported action type sent to dispatch';
      }
      return true;
    }
  }, {
    key: 'getActions',
    value: function getActions() {
      return this.actions;
    }
  }]);

  return MockStore;
}();

exports.default = MockStore;
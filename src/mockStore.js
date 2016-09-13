import _ from 'lodash';

export default class MockStore {

  constructor() {
    this.reset();
    this._mockDispatch = this._mockDispatch.bind(this);
  }

  reset() {
    this.state = {};
    this.actions = [];
  }

  setState(newState) {
    this.state = newState;
  }

  getState() {
    return this.state;
  }

  dispatchSync(action) {
    let done = false;
    let result;
    action(this._mockDispatch, this.getState).then((r) => {
      result = r;
      done = true;
    });
    require('deasync').loopWhile(() => !done);
    return result;
  }

  dispatch(action) {
    return action();
  }

  _mockDispatch(action) {
    if (_.isFunction(action)) {
      this.actions = [...this.actions, action.name];
    } else if (_.has(action, 'type')) {
      this.actions = [...this.actions, action];
    } else {
      throw new Error('Unsupported action type sent to dispatch');
    }
    return true;
  }

  getActions() {
    return this.actions;
  }
}

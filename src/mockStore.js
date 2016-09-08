import _ from 'lodash';

export default class MockStore {

  constructor() {
    this.reset();
    this.mockDispatch = this.mockDispatch.bind(this);
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
    action(this.mockDispatch, this.getState).then((r) => {
      result = r;
      done = true;
    });
    require('deasync').loopWhile(() => !done);
    //require('deasync').sleep(100);
    return result;
  }

  dispatch(action) {
    return action();
  }

  mockDispatch(action) {
    if (_.isFunction(action)) {
      this.actions = [...this.actions, action.name];
    } else if (_.has(action, 'type')) {
      this.actions = [...this.actions, action];
    } else {
      throw ('Unsupported action type sent to dispatch');
    }
    return true;
  }

  getActions() {
    return this.actions;
  }
}

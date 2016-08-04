import _ from 'lodash';

export default class MockStore {

  constructor() {
    this.reset();
    this.innerDispatch = this.innerDispatch.bind(this);
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
    action(this.innerDispatch, this.getState).then(() => done = true);
    require('deasync').loopWhile(() => !done);
  }

  dispatch(action) {
    action();
  }

  innerDispatch(action) {
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
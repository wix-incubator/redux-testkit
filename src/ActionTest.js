import _ from 'lodash';

export class ActionTest {
  constructor() {
    this.reset();
    this.mockDispatch = this.mockDispatch.bind(this);
    this.getState = this.getState.bind(this);
  }

  reset() {
    this.state = {};
    this.dispatched = [];
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  getDispatched(index) {
    return _.isNumber(index) ? this.dispatched[index] : this.dispatched;
  }

  dispatchSync(action) {
    let done = false;
    let finalResult;
    let error;

    if (_.isFunction(action)) {
      const result = action(this.mockDispatch, this.getState);

      if (result instanceof Promise) {
        result.then((r) => {
          finalResult = r;
          done = true;
        }).catch((e) => {
          error = e;
          done = true;
        });
        require('deasync').loopWhile(() => !done);
      } else {
        finalResult = result;
      }
    } else {
      finalResult = action;
    }

    if (error) {
      throw error;
    }

    return finalResult;
  }

  mockDispatch(action) {
    if (_.isFunction(action)) {
      this.dispatched.push(new DispatchedFunction(action));
    } else if (_.has(action, '_instance')) {
      this.dispatched.push(new DispatchedEvent(action));
    } else if (_.has(action, 'type')) {
      this.dispatched.push(new DispatchedObject(action));
    } else {
      throw new Error('Unsupported action type sent to dispatch');
    }
    return true;
  }
}

class Dispatched {
  constructor(dispatched) {
    this.action = dispatched;
  }

  getName() {
    //
  }

  getType() {
    //
  }

  isFunction() {
    return false;
  }

  isPlainObject() {
    return false;
  }

  getParams() {
    //
  }
}

class DispatchedObject extends Dispatched {
  getType() {
    return this.action.type;
  }

  isPlainObject() {
    return true;
  }

  getParams() {
    return this.action;
  }
}

class DispatchedFunction extends Dispatched {
  isFunction() {
    return true;
  }

  getName() {
    return this.action.name;
  }
}

class DispatchedEvent extends Dispatched {
  isEvent() {
    return true;
  }

  getInstance() {
    return this.action._instance;
  }

  getInstanceType() {
    return this.getInstance().constructor;
  }

  getParams() {
    return this.getInstance().params;
  }
}

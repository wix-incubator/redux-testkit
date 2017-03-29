import _ from 'lodash';

let dispatches = [];
let state;
let error;

function createDispatchedObject(action) {
  return {
    isFunction: () => _.isFunction(action),
    isPlainObject: () => _.isPlainObject(action),
    getType: () => _.get(action, 'type'),
    getAction: () => action,
    getName: () => _.get(action, 'name')
  };
}

function getState() {
  return state;
}

async function dispatch(action) {
  if (!_.isFunction(action) && !_.isPlainObject()) {
    error = new Error('Unsupported action type sent to dispatch');
  }

  dispatches.push(createDispatchedObject(action));
}

async function executeDispatch(action) {
  if (_.isFunction(action)) {
    const result = action(dispatch, getState);
    return Promise.resolve(result);
  }

  error = new Error('its not a thunk function');
  return null;
}

// todo: handle immutability
export default function(thunkFunction, storeState) {
  dispatches = [];
  state = storeState;
  error = undefined;

  return {
    execute: async () => {
      await executeDispatch(thunkFunction);
      return dispatches;
    }
  };
}

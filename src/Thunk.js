import _ from 'lodash';
import * as utils from './utils';

let dispatches = [];
let state;
let originalState;
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
  if (!_.isFunction(action) && !_.isPlainObject(action)) {
    error = new Error(`Unsupported ${action} action type sent to dispatch`);
  }

  dispatches.push(createDispatchedObject(action));
}

async function executeDispatch(action) {
  if (_.isFunction(action)) {
    const result = await action(dispatch, getState);
    return Promise.resolve(result);
  }

  error = new Error('its not a thunk function');
  return null;
}

function checkForStateMutation() {
  const mutated = !utils.deepEqual(state, originalState);
  
  if (mutated) {
    error = new Error('State mutation is not valid inside an action');
  }
}

// todo: handle immutability
export default function(thunkFunction, storeState) {
  dispatches = [];
  state = storeState;
  originalState = _.cloneDeep(storeState);
  error = undefined;

  return {
    execute: async () => {
      if (_.isFunction(thunkFunction)) {
        await executeDispatch(thunkFunction());
        checkForStateMutation();
      } else {
        error = new Error('Thunk testkit only accept a thunk function');
      }

      if (error) {
        throw error;
      }
      return dispatches;
    }
  };
}

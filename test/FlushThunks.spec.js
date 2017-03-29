import {FlushThunks} from '../src';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

let test;

function reducer(state = {count: 0}, action = {}) {
  if (action.type === 'count') {
    state.count++;
  }

  return state;
}

describe('FlushThunks spec', () => {
  let store;
  let flushThunks;

  beforeEach(() => {
    flushThunks = FlushThunks.createMiddleware();
    store = createStore(reducer, applyMiddleware(flushThunks, thunk));
  });

  it('should wait for all dispatched promises - simple flow', async () => {
    expect(store.getState().count).toBe(0);
    store.dispatch(asyncAction1());
    expect(store.getState().count).toBe(0);
    await flushThunks.flush();
    expect(store.getState().count).toBe(1);
  });

  it('should wait for all dispatched promises - complex flow', async () => {
    store.dispatch(asyncAction3());
    await flushThunks.flush();
    expect(store.getState().count).toBe(1);
  });

  it('should wait for all dispatched promises - complex flow 2', async () => {
    store.dispatch(asyncAction4());
    await flushThunks.flush();
    expect(store.getState().count).toBe(2);
  });

  it('should wait for all dispatched promises - crazy flow', async () => {
    store.dispatch(asyncAction5());
    await flushThunks.flush();
    expect(store.getState().count).toBe(5);
  });
});

const asyncAction1 = () => {
  return async (dispatch, getState) => {
    await asyncFunc();
    dispatch({type: 'count'});
  };
};

const asyncAction2 = () => {
  return async (dispatch, getState) => {
    await asyncFunc();
    dispatch(asyncAction1());
  };
};

const asyncAction3 = () => {
  return async (dispatch, getState) => {
    dispatch(asyncAction2());
  };
};

const asyncAction4 = () => {
  return async (dispatch, getState) => {
    dispatch(asyncAction2());
    await asyncFunc();
    dispatch(asyncAction1());
  };
};

const asyncAction5 = () => {
  return async (dispatch, getState) => {
    dispatch(asyncAction2());
    await asyncFunc();
    dispatch(asyncAction1());
    await asyncFunc();
    dispatch(asyncAction4());
    await asyncFunc();
    dispatch(asyncAction3());
  };
};

const asyncFunc = () => {
  return new Promise((res) => {
    setImmediate(() => {
      test++;
      res();
    });
  });
};

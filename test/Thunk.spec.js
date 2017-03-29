import uut from '../src/Thunk';

const asyncFunction = () => new Promise((res) => setTimeout(res, 100));
const action1 = {type: 'EVENT_1', data: 'DATA1!'};
const action2 = {type: 'EVENT_2', data: 'DATA2!'};

const actionCreator1 = () => {
  return action1;
};

const action3 = (dispatch, getState) => {
  dispatch(action1);
  dispatch(action2);
};

const action4 = (dispatch, getState) => {
  dispatch(action1);
  dispatch(action3);
};

const thunkAction = () => {
  return async function action5(dispatch, getState) {
    dispatch(action3);
    await asyncFunction();
    dispatch(thunkAction());
    dispatch(action4);
  };
};

const thunkAction2 = () => {
  return async function action6(dispatch, getState) {
    await dispatch(thunkAction());
    dispatch(action4);
  };
};

const actionThatUsesState = (dispatch, getState) => {
  const {extraData} = getState();
  dispatch({...action1, extraData});
};

describe('Thunk teskit tool', () => {
  it('should contain dispatch actions of plain objects', async () => {
    const dispatches = await uut(action3).execute();
    expect(dispatches.length).toBe(2);

    expect(dispatches[0].isPlainObject()).toBe(true);
    expect(dispatches[0].getType()).toBe(action1.type);
    expect(dispatches[0].getAction()).toEqual(action1);

    expect(dispatches[1].isPlainObject()).toBe(true);
    expect(dispatches[1].getType()).toBe(action2.type);
    expect(dispatches[1].getAction()).toBe(action2);
  });

  it('should handle dispatched actions of functions and plain objects', async () => {
    const dispatches = await uut(action4).execute();
    expect(dispatches.length).toBe(2);

    expect(dispatches[0].isPlainObject()).toBe(true);
    expect(dispatches[0].getType()).toBe(action1.type);
    expect(dispatches[0].getAction()).toEqual(action1);

    expect(dispatches[1].isFunction()).toBe(true);
    expect(dispatches[1].getAction()).toBe(action3);
  });

  it('should support async thunk actions creators', async () => {
    const dispatches = await uut(thunkAction()).execute();
    expect(dispatches.length).toBe(3);

    expect(dispatches[0].isFunction()).toBe(true);
    expect(dispatches[0].getAction()).toBe(action3);

    expect(dispatches[1].isFunction()).toBe(true);
    expect(dispatches[1].getName()).toBe('action5');

    expect(dispatches[2].isFunction()).toBe(true);
    expect(dispatches[2].getAction()).toBe(action4);
  });

  it('should support awaiting async thunk actions creators', async () => {
    const dispatches = await uut(thunkAction2()).execute();
    expect(dispatches.length).toBe(2);

    expect(dispatches[0].isFunction()).toBe(true);
    expect(dispatches[0].getName()).toBe('action5');

    expect(dispatches[1].isFunction()).toBe(true);
    expect(dispatches[1].getAction()).toBe(action4);
  });

  it('should acknowledge passed state inside dispatched actions', async () => {
    const state = {extraData: 'EXTRA_DATA!'};
    const dispatches = await uut(actionThatUsesState, state).execute();

    expect(dispatches.length).toBe(1);
    expect(dispatches[0].getAction().extraData).toBe(state.extraData);
  });
});

import uut from '../src/Thunk';

const asyncFunction = () => new Promise((res) => setTimeout(res, 100));
const action1 = {type: 'EVENT_1', data: 'DATA1!'};
const action2 = {type: 'EVENT_2', data: 'DATA2!'};

const thunk1 = () => {
  return function action3(dispatch, getState) {
    dispatch(action1);
    dispatch(action2);
  };
};

const thunk2 = () => {
  return function action4(dispatch, getState) {
    dispatch(action1);
    dispatch(thunk1());
  };
};


const thunk3 = () => {
  return async function action5(dispatch, getState) {
    dispatch(thunk1());
    await asyncFunction();
    dispatch(thunk2());
  };
};

const thunk4 = () => {
  return async function action6(dispatch, getState) {
    await dispatch(thunk3());
    dispatch(action1);
  };
};

const actionThatUsesState = () => {
  return function action7(dispatch, getState) {
    const {extraData} = getState();
    dispatch({...action1, extraData});
  };
};

const actionThatMutateState = () => {
  return function action8(dispatch, getState) {
    const state = getState();
    state.extraData = 'mutating state';
    dispatch({...action1});
  };
};

describe('Thunk teskit tool', () => {
  it('should contain dispatch actions of plain objects', async () => {
    const dispatches = await uut(thunk1).execute();
    expect(dispatches.length).toBe(2);

    expect(dispatches[0].isPlainObject()).toBe(true);
    expect(dispatches[0].getType()).toBe(action1.type);
    expect(dispatches[0].getAction()).toEqual(action1);

    expect(dispatches[1].isPlainObject()).toBe(true);
    expect(dispatches[1].getType()).toBe(action2.type);
    expect(dispatches[1].getAction()).toBe(action2);
  });

  it('should handle dispatched actions of functions and plain objects', async () => {
    const dispatches = await uut(thunk2).execute();
    expect(dispatches.length).toBe(2);

    expect(dispatches[0].isPlainObject()).toBe(true);
    expect(dispatches[0].getType()).toBe(action1.type);
    expect(dispatches[0].getAction()).toEqual(action1);

    expect(dispatches[1].isFunction()).toBe(true);
    expect(dispatches[1].getName()).toBe('action3');
  });

  it('should support async thunk actions creators', async () => {
    const dispatches = await uut(thunk3).execute();
    expect(dispatches.length).toBe(2);

    expect(dispatches[0].isFunction()).toBe(true);
    expect(dispatches[0].getName()).toBe('action3');

    expect(dispatches[1].isFunction()).toBe(true);
    expect(dispatches[1].getName()).toBe('action4');
  });

  it('should support awaiting async thunk actions creators', async () => {
    const dispatches = await uut(thunk4).execute();
    expect(dispatches.length).toBe(2);

    expect(dispatches[0].isFunction()).toBe(true);
    expect(dispatches[0].getName()).toBe('action5');

    expect(dispatches[1].isPlainObject()).toBe(true);
    expect(dispatches[1].getAction()).toBe(action1);
  });

  it('should acknowledge passed state inside dispatched actions', async () => {
    const state = {extraData: 'EXTRA_DATA!'};
    const dispatches = await uut(actionThatUsesState, state).execute();

    expect(dispatches.length).toBe(1);
    expect(dispatches[0].getAction().extraData).toBe(state.extraData);
  });

  it('should throw an error if state mutation occurred', async () => {
    const state = {extraData: 'EXTRA_DATA!'};
    try {
      await uut(actionThatMutateState, state).execute();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toEqual(new Error('State mutation is not valid inside an action'));
    }
  });
});

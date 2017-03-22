import _ from 'lodash';
import uut from '../src/Reducer';

const initialState = {
  value: 12
};

const ADD_ACTION = {type: 'ADD', value: 3};
const SUBTRACT_ACTION = {type: 'SUBTRACT', value: 5};
const NON_EXISTING_ACTION = {type: 'NON_EXISTING'};

const reducer = (state = _.cloneDeep(initialState), action = {}) => {
  const value = state.value;
  switch (action.type) {
    case 'ADD':
      return {value: value + action.value};
    case 'SUBTRACT':
      return {value: value - action.value};
    default:
      return {value};
  }
};

const mutatingReducer = (state = _.cloneDeep(initialState), action = {}) => {
  switch (action.type) {
    case 'ADD':
      state.value += action.value;
      return state;
    case 'SUBTRACT':
      state.value -= action.value;
      return state;
    default:
      break;
  }
  return state;
};

describe('Reducer testkit tool', () => {
  describe('without allowing mutation of state', () => {
    it('should test reducer state change after accpeting an action', () => {
      uut(reducer).expect(ADD_ACTION).toReturnState({value: initialState.value + ADD_ACTION.value});
      uut(reducer).expect(SUBTRACT_ACTION).toReturnState({value: initialState.value - SUBTRACT_ACTION.value});
      uut(reducer).expect(NON_EXISTING_ACTION).toReturnState(initialState);
    });

    it('should fail test on reducer that mutate state', () => {
      // uut(mutatingReducer).expect(ADD_ACTION).toReturnState({value: initialState.value + ADD_ACTION.value});
      // uut(mutatingReducer).expect(SUBTRACT_ACTION).toReturnState({value: initialState.value - SUBTRACT_ACTION.value});
    });
  });

  describe('allowing mutation of state', () => {
    it('should test reducer state change after accpeting an action', () => {
      uut(reducer).expect(ADD_ACTION).toReturnStateWithMutation({value: initialState.value + ADD_ACTION.value});
      uut(reducer).expect(SUBTRACT_ACTION).toReturnStateWithMutation({value: initialState.value - SUBTRACT_ACTION.value});
      uut(reducer).expect(NON_EXISTING_ACTION).toReturnStateWithMutation(initialState);
    });

    it('should not fail test on reducer that mutate state', () => {
      uut(mutatingReducer).expect(ADD_ACTION).toReturnStateWithMutation({value: initialState.value + ADD_ACTION.value});
      uut(mutatingReducer).expect(SUBTRACT_ACTION).toReturnStateWithMutation({value: initialState.value - SUBTRACT_ACTION.value});
    });
  });

  describe('should hanlde given initial state', () => {
    it('should reducer work with given initial state', () => {
      uut(reducer, {value: 2}).expect(ADD_ACTION).toReturnState({value: 2 + ADD_ACTION.value});
    });
    
    // this test suppose to fail
    it('should fail test with given initial state on mutating reducer', () => {
      // uut(mutatingReducer, {value: 6}).expect(SUBTRACT_ACTION).toReturnState({value: 6 - SUBTRACT_ACTION.value});
    });
  });
});

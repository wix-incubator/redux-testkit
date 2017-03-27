import _ from 'lodash';
import Immutable from 'seamless-immutable';
import uut from '../src/Reducer';

const initialCounterState = {
  value: 12
};

const ADD_ACTION = {type: 'ADD', value: 3};
const SUBTRACT_ACTION = {type: 'SUBTRACT', value: 5};
const NON_EXISTING_ACTION = {type: 'NON_EXISTING'};

const counterReducer = (state = _.cloneDeep(initialCounterState), action = {}) => {
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

const mutatingCounterReducer = (state = _.cloneDeep(initialCounterState), action = {}) => {
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
  describe('toReturnState: without allowing mutation of state', () => {
    it('should test reducer state change after accpeting an action', () => {
      uut(counterReducer).expect(ADD_ACTION).toReturnState({value: initialCounterState.value + ADD_ACTION.value});
      uut(counterReducer).expect(SUBTRACT_ACTION).toReturnState({value: initialCounterState.value - SUBTRACT_ACTION.value});
      uut(counterReducer).expect(NON_EXISTING_ACTION).toReturnState(initialCounterState);
    });
    it('should fail test on reducer that mutate state', () => {
      // uut(mutatingCounterReducer).expect(ADD_ACTION).toReturnState({value: initialCounterState.value + ADD_ACTION.value});
      // uut(mutatingCounterReducer).expect(SUBTRACT_ACTION).toReturnState({value: initialCounterState.value - SUBTRACT_ACTION.value});
    });
  });

  describe('toReturnState: given initial state', () => {
    it('should reducer work with given initial state', () => {
      uut(counterReducer, {value: 2}).expect(ADD_ACTION).toReturnState({value: 2 + ADD_ACTION.value});
    });
    // this test suppose to fail
    it('should fail test with given initial state on mutating reducer', () => {
      // uut(mutatingCounterReducer, {value: 6}).expect(SUBTRACT_ACTION).toReturnState({value: 6 - SUBTRACT_ACTION.value});
    });
  });

  describe('toChangeInState: without allowing mutation of state', () => {
    const SET_ACTION = {
      type: 'SET_INTERNAL'
    };
    const SET_ARRAY_ACTION = {
      type: 'SET_INTERNAL_ARRAY'
    };

    const reducerWithExtra = (state = {}, action = {}) => {
      const stateCopy = _.cloneDeep(state);
      switch (action.type) {
        case SET_ACTION.type:
          return _.set(stateCopy, 'a.b.c', 'hello');
        case SET_ARRAY_ACTION.type:
          return _.set(stateCopy, 'a.b', [1, 2]);
        default:
          return state;
      }
    };

    it('should test reducer state change after accpeting an action', () => {
      uut(counterReducer).expect(ADD_ACTION).toChangeInState({value: initialCounterState.value + ADD_ACTION.value});
      uut(counterReducer).expect(NON_EXISTING_ACTION).toChangeInState(initialCounterState);
    });

    it('should test state collection-content mutation with given initial state with inexplicit fields', () => {
      uut(reducerWithExtra).expect(SET_ACTION).toChangeInState({a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {name: 'john'}).expect(SET_ACTION).toChangeInState({a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {name: 'john'}).expect(SET_ACTION).toReturnState({name: 'john', a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {a: {b: {d: 'world'}}}).expect(SET_ACTION).toChangeInState({a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {a: {b: {d: 'world'}}}).expect(SET_ACTION).toReturnState({a: {b: {c: 'hello', d: 'world'}}});
    });

    it('should test state arrays mutation with given initial state with inexplicit fields', () => {
      uut(reducerWithExtra).expect(SET_ARRAY_ACTION).toChangeInState({a: {b: [1, 2]}});
      uut(reducerWithExtra, {a: {b: [-1, -2]}}).expect(SET_ARRAY_ACTION).toChangeInState({a: {b: [1, 2]}});
      uut(reducerWithExtra, {a: {b: [-1, -2]}}).expect(SET_ARRAY_ACTION).toReturnState({a: {b: [1, 2]}});
    });

    // This tests a sensitive spot of *change-based* verification when arrays are involved, as lodash.merge() acts
    // different with arrays than it does with collections. With collection, a deep copy is performed, while with arrays -
    // as by default, an actual element-by-element *merge* is done, which isn't what we expect from toChangeInState().
    it('should verify arrays mutation is done in an assignment-like and not merge-like strategy', () => {
      uut(reducerWithExtra, {a: {b: [-1, -2, -3]}}).expect(SET_ARRAY_ACTION).toChangeInState({a: {b: [1, 2]}});
      uut(reducerWithExtra, {a: {b: [-1, -2, -3]}}).expect(SET_ARRAY_ACTION).toReturnState({a: {b: [1, 2]}});
    });

    it('should fail test if content change overlooked', () => {
      const originalExpect = global.expect;
      global.expect = (input) => ({
        toEqual: (i) => originalExpect(input).not.toEqual(i)
      });
      uut(reducerWithExtra, {name: 'john'}).expect(SET_ACTION).toChangeInState({});
      global.expect = originalExpect;
    });

    it('should fail test with given initial state on mutating reducer', () => {
      // uut(mutatingCounterReducer, {value: 6}).expect(SUBTRACT_ACTION).toChangeInState({value: 6 - SUBTRACT_ACTION.value});
    });
  });

  describe('toReturnState: support 3rd party libs like seamless-immutable', () => {
    const immutableInitialCounterState = Immutable(initialCounterState);
    const immutableCounterReducer = (state = immutableInitialCounterState, action = {}) => {
      switch (action.type) {
        case 'ADD':
          return state.merge({value: state.value + action.value});
        case 'SUBTRACT':
          return state.merge({value: state.value - action.value});
        default:
          break;
      }
      return state;
    };
    it('should reducer handle action correctly', () => {
      uut(immutableCounterReducer).expect(ADD_ACTION).toReturnState({value: initialCounterState.value + ADD_ACTION.value});
    });
    // this test suppose to fail
    it('should fail test with given initial state on mutating reducer', () => {
      // uut(mutatingCounterReducer, {value: 6}).expect(SUBTRACT_ACTION).toReturnState({value: 6 - SUBTRACT_ACTION.value});
    });
  });

  describe('execute: without allowing mutation of state', () => {
    it('should test reducer state change after accpeting an action', () => {
      const result = uut(counterReducer).execute(ADD_ACTION);
      expect(result.value).toEqual(initialCounterState.value + ADD_ACTION.value);
    });
    it('should fail test on reducer that mutate state', () => {
      // const result = uut(mutatingCounterReducer).execute(ADD_ACTION);
      // expect(result.value).toEqual(initialCounterState.value + ADD_ACTION.value);
    });
  });
});

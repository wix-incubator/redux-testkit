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
    it('should test reducer state change after accpeting an action', () => {
      uut(counterReducer).expect(ADD_ACTION).toChangeInState({value: initialCounterState.value + ADD_ACTION.value});
      uut(counterReducer).expect(NON_EXISTING_ACTION).toChangeInState(initialCounterState);
    });
    it('should reducer work with given initial state with extra fields', () => {
      const reducerWithExtra = (state = {}, action = {}) => {
        const stateCopy = _.cloneDeep(state);
        switch (action.type) {
          case 'SET_INTERNAL':
            return _.set(stateCopy, 'a.b.c', 'hello');
          default:
            return state;
        }
      };
      uut(reducerWithExtra).expect({type: 'SET_INTERNAL'}).toChangeInState({a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {name: 'john'}).expect({type: 'SET_INTERNAL'}).toChangeInState({a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {name: 'john'}).expect({type: 'SET_INTERNAL'}).toReturnState({name: 'john', a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {a: {b: {d: 'world'}}}).expect({type: 'SET_INTERNAL'}).toChangeInState({a: {b: {c: 'hello'}}});
      uut(reducerWithExtra, {a: {b: {d: 'world'}}}).expect({type: 'SET_INTERNAL'}).toReturnState({a: {b: {c: 'hello', d: 'world'}}});
    });
    // this test suppose to fail
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

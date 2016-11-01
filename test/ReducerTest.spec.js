import 'jasmine-expect';
import {ReducerTest} from '../src/ReducerTest';
import Immutable from 'seamless-immutable';

const reducer = (state, action) => {
  const val = state.val;
  switch(action.type) {
    case 'ADD':
      return {val: val + action.val};
    case 'MINUS':
      return {val: val - action.val};
    default:
      return {val};
  }
};

const mutatingReducer = (state, action) => {
  switch(action.type) {
    case 'ADD':
      state.val = state.val + action.val;
      return state;
    case 'MINUS':
      state.val = state.val - action.val;
      return state;
      break;
  }
  return state;
};

const params = [
  {
    action: {type: 'ADD', val: 5},
    expected: {val: 17}
  },
  {
    state: {val: 10},
    action: {type: 'MINUS', val: 4},
    expected: {val: 6}
  },
  {
    action: {type: 'XXXX', val: 5},
    expected: {val: 12}
  }
];

describe('immutable ReducerTest', () => {

  const uut = new ReducerTest(reducer, {val: 12});

  uut.test('Test adding and stuff on immutable reducer', params,
      (result, expected, didMutate) => {
        expect(result).toEqual(expected);
        expect(didMutate).toBeFalse();
      }
  );

});

describe('mutating ReducerTest', () => {

  const uut = new ReducerTest(mutatingReducer, {val: 12});

  uut.test('Test adding and stuff on mutable reducer', params.slice(0,2),
      (result, expected, didMutate) => {
        expect(result).toEqual(expected);
        expect(didMutate).toBeTrue();
      }
  );

});

describe('mutating ReducerTest', () => {

  const uut = new ReducerTest(mutatingReducer, {val: 12}).throwOnMutation();

  it('can be constructed', () => {
    expect(uut).toBeObject();
  });

  //THIS THROWS AN EXCEPTION SO FAILS!
  //uut.test('Test adding and stuff on mutable reducer', params[0], () => {});

});

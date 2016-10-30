import 'jasmine-expect';
import {ReducerTest} from '../src/ReducerTest';

const reducer = (state, action) => {
  const val = state.val;
  switch(action.type) {
    case 'ADD':
      return {val: val + action.val};
    case 'MINUS':
      return {val: val - action.val};
    default:
      return {val: val};
  }
};

const params = [
  {
    state: {val: 0},
    action: {type: 'ADD', val: 5},
    expected: {val: 5}
  },
  {
    state: {val: 10},
    action: {type: 'MINUS', val: 4},
    expected: {val: 6}
  },
  {
    state: {val: 23},
    action: {type: 'XXXX', val: 5},
    expected: {val: 23}
  }
];

describe('ReducerTest', () => {

  const uut = new ReducerTest(reducer);

  it('can be constructed', () => {
    expect(uut).toBeObject();
  });


  uut.test('Test adding and stuff on immutable reducer', params,
      (result, expected, didMutate) => expect(result).toEqual(expected)
  );

});

import _ from 'lodash';
import reducer from '../src/Reducer';
import selector from '../src/Selector';

const initialState = {
  names: []
};

function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case 'ADD_PERSON':
      //state.names.push(action.addedName);
      //return state;
      return {...state, names: state.names.concat([action.addedName])};
    default:
      return state;
  }
}

describe('reducer bug', () => {
  it('should not mutate state', () => {
    const action = {type: 'ADD_PERSON', addedName: 'John'};
    const result = {names: ['John']};
    reducer(reduce).expect(action).toReturnState(result);
  });
});

function getReverseNames(state) {
  //return state.names.reverse();
  return _.reverse(_.cloneDeep(state.names));
}

describe('selector bug', () => {
  it('should not mutate state', () => {
    const state = {names: ['John', 'Rob']};
    const result = ['Rob', 'John'];
    selector(getReverseNames).expect(state).toReturn(result);
  });
});

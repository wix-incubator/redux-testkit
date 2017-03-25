import _ from 'lodash';
import Immutable from 'seamless-immutable';
import uut from '../src/Selector';

const exampleState = Immutable({
  example: {
    numbers: [1, 2.2, 3.14, 4, 5.75, 6]
  }
});

const mutatbleState = {
  example: {
    numbers: [1, 2, 3]
  }
};

function getIntegersSelector(state) {
  return _.filter(state.example.numbers, (v) => Number.isInteger(v));
}

function getLargerThanSelector(state, than) {
  return _.filter(state.example.numbers, (v) => v > than);
}

function mutatingReverseSelector(state) {
  return state.example.numbers.reverse();
}

describe('Selector testkit tool', () => {
  it('should test selector is running without extra arguments', () => {
    uut(getIntegersSelector).expect(exampleState).toReturn([1, 4, 6]);
  });

  it('should test selector is running with extra arguments', () => {
    uut(getLargerThanSelector).expect(exampleState, 3.5).toReturn([4, 5.75, 6]);
  });

  it('should fail test on selector that mutate state', () => {
    // uut(mutatingReverseSelector).expect(mutatbleState).toReturn([3, 2, 1]);
  });
});

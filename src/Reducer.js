import _ from 'lodash';

export default function(reducer, state) {
  const initialState = state || reducer(undefined, {});
  return {
    expect: (action) => {
      const originalState = _.cloneDeep(initialState);
      const newState = reducer(initialState, action);
      
      const mutated = !deepEqual(initialState, originalState);

      return {
        toReturnState: (expected) => {
          expect(newState).toEqual(expected);
          expect(mutated).toEqual(false);
        },
        toReturnStateWithMutation: (expected) => {
          expect(newState).toEqual(expected);
        }
      };
    }
  };
}


function deepEqual(x, y) {
  if ((typeof x === "object" && x !== null) && (typeof y === "object" && y !== null)) {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }

    for (let prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  } else if (x !== y) {
    return false;
  } else {
    return true;
  }
}

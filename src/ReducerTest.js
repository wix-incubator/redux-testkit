/*eslint prefer-const: 0*/
import _ from 'lodash';

export class ReducerTest {
  constructor(reduce, initialState = {}) {
    this.uut = reduce;
    this.initialState = initialState;
    this.deepEqual = this.deepEqual.bind(this);
    this.shoudThrowOnMutation = false;
  }

  throwOnMutation() {
    this.shoudThrowOnMutation = true;
    return this;
  }

  //params = [ {state?, action, expected, description?} ]
  test(name, params, testEqual) {
    _.forEach(params, (param, index) => {
      it(`${index}:${name}  ${(param.description || '')}`, () => {
        let {state, action, expected} = param;
        state = state ? state : this.initialState;

        const originalState = _.cloneDeep(state);

        const result = this.uut(state, action);

        const didMutate = !this.deepEqual(state, originalState);

        if (didMutate && this.shoudThrowOnMutation) {
          throw new Error(`${index}:${name}  ${(param.description || '')} mutated the state!`);
        }

        testEqual(result, expected, didMutate);
      });
    });
  }

  deepEqual(x, y) {
    if ((typeof x === "object" && x !== null) && (typeof y === "object" && y !== null)) {
      if (Object.keys(x).length !== Object.keys(y).length) {
        return false;
      }

      for (let prop in x) {
        if (y.hasOwnProperty(prop)) {
          if (!this.deepEqual(x[prop], y[prop])) {
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
}

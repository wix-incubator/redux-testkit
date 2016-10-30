import _ from 'lodash';

export class ReducerTest {
  constructor(reduce) {
    this.uut = reduce;
  }

  //[ {state, action, expected, description} ]
  test(name, params, testEqual) {
     _.forEach(params, (param, index) => {
      it(`${index}:${name}  ${(param.description || '')}`,  () => {
        const {state, action, expected} = param;
        const result = this.uut(state, action);
        testEqual(result, expected);
      });
    });
  }

   deepEqual(x, y) {
    if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
      if (Object.keys(x).length != Object.keys(y).length)
        return false;

      for (var prop in x) {
        if (y.hasOwnProperty(prop))
        {
          if (! this.deepEqual(x[prop], y[prop]))
            return false;
        }
        else
          return false;
      }

      return true;
    }
    else if (x !== y)
      return false;
    else
      return true;
  }
}

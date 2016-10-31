import _ from 'lodash';

export class ReducerTest {
  constructor(reduce, initialState = {}) {
    this.uut = reduce;
    this.initialState = initialState;
  }

  //params = [ {state?, action, expected, description?} ]
  test(name, params, testEqual) {
     _.forEach(params, (param, index) => {
      it(`${index}:${name}  ${(param.description || '')}`,  () => {
        let {state, action, expected} = param;
        state = state ? state : _.cloneDeep(this.initialState);
        const result = this.uut(state, action);
        testEqual(result, expected);
      });
    });
  }
}

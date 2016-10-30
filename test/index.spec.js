import 'jasmine-expect';
import {ActionTest, ReducerTest} from './../dist/index';

describe('index', () => {
  it('exposes ActionTest', () => {
    expect(ActionTest).toBeDefined();
  });
});

describe('index', () => {
  it('exposes ReducerTest', () => {
    expect(ReducerTest).toBeDefined();
  });
});

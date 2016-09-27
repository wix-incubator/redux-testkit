import 'jasmine-expect';
import {ActionTest} from '../src/ActionTest';

describe('ActionTest', () => {
  let uut = null;

  beforeEach(() => {
    uut = new ActionTest();
  });

  it('can be constructed', () => {
    expect(uut).toBeObject();
  });

  it('starts with empty state', () => {
    expect(uut.getState()).toEqual({});
  });

  it('starts with empty actions', () => {
    expect(uut.getDispatched()).toEqual([]);
  });

  it('holds state', () => {
    uut.setState({a: 123, b: 456});
    expect(uut.getState()).toEqual({a: 123, b: 456});
  });

  it('can be reset', () => {
    uut.setState({a: 123, b: 456});
    uut.getDispatched().push('hello');
    uut.reset();
    expect(uut.getState()).toEqual({});
    expect(uut.getDispatched()).toEqual([]);
  });
});

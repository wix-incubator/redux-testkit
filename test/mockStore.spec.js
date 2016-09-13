import 'jasmine-expect';
import MockStore from '../src/mockStore';

describe('mockStore', () => {
  let uut = null;

  beforeEach(() => {
    uut = new MockStore();
  });

  it('can be constructed', () => {
    expect(uut).toBeObject();
  });

  it('starts with empty state', () => {
    expect(uut.getState()).toEqual({});
  });

  it('starts with empty actions', () => {
    expect(uut.getActions()).toEqual([]);
  });

  it('holds state', () => {
    uut.setState({a: 123, b: 456});
    expect(uut.getState()).toEqual({a: 123, b: 456});
  });

  it('can be reset', () => {
    uut.setState({a: 123, b: 456});
    uut.getActions().push('hello');
    uut.reset();
    expect(uut.getState()).toEqual({});
    expect(uut.getActions()).toEqual([]);
  });
});

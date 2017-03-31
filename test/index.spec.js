import {Reducer, Selector, Thunk, FlushThunks} from './../dist/index';

describe('index', () => {
  it('exposes Reducer', () => {
    expect(Reducer).toBeDefined();
  });

  it('exposes Selector', () => {
    expect(Selector).toBeDefined();
  });

  it('exposes Thunk', () => {
    expect(Thunk).toBeDefined();
  });

  it('exposes Thunk', () => {
    expect(Thunk).toBeDefined();
  });

  it('exposes FlushThunks', () => {
    expect(FlushThunks).toBeDefined();
  });
});

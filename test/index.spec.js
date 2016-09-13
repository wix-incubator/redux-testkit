import 'jasmine-expect';
import {MockStore} from './../lib/index';

describe('index', () => {
  it('exposes MockStore', () => {
    expect(MockStore).toBeDefined();
  });
});

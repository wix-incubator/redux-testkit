import 'jasmine-expect';
import {ActionTest} from '../src/ActionTest';

const syncAction = (dispatch, getState) => {
  dispatch({type: 'EVENT_1', data: 'DATA1!'});
  dispatch(syncAction);
  dispatch({type: 'EVENT_2', data: getState().exisitingData + '_MODIFIED'})
};

const asyncAction = () => async function asyncInternal(dispatch, getState) {
  dispatch({type: 'EVENT_1', data: 'DATA1!'});
  dispatch(asyncAction());
  dispatch({type: 'EVENT_2', data: getState().exisitingData + '_MODIFIED'})

};

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

  it('tests a synchronous action', () => {
    uut.setState({exisitingData: 'EXISITNG'});
    uut.dispatchSync(syncAction);
    expect(uut.getDispatched(0).isPlainObject()).toBeTrue();
    expect(uut.getDispatched(0).getType()).toEqual('EVENT_1');
    expect(uut.getDispatched(0).getParams().data).toEqual('DATA1!');

    expect(uut.getDispatched(1).isFunction()).toBeTrue();
    expect(uut.getDispatched(1).getName()).toEqual('syncAction');

    expect(uut.getDispatched(2).isPlainObject()).toBeTrue();
    expect(uut.getDispatched(2).getType()).toEqual('EVENT_2');
    expect(uut.getDispatched(2).getParams().data).toEqual('EXISITNG_MODIFIED');
  });

  it('tests an asynchronous action', () => {
    uut.setState({exisitingData: 'EXISITNG'});
    uut.dispatchSync(asyncAction());
    expect(uut.getDispatched(0).isPlainObject()).toBeTrue();
    expect(uut.getDispatched(0).getType()).toEqual('EVENT_1');
    expect(uut.getDispatched(0).getParams().data).toEqual('DATA1!');

    expect(uut.getDispatched(1).isFunction()).toBeTrue();
    expect(uut.getDispatched(1).getName()).toEqual('asyncInternal');

    expect(uut.getDispatched(2).isPlainObject()).toBeTrue();
    expect(uut.getDispatched(2).getType()).toEqual('EVENT_2');
    expect(uut.getDispatched(2).getParams().data).toEqual('EXISITNG_MODIFIED');
  });
});

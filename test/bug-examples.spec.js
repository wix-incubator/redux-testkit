import _ from 'lodash';
import reducer from '../src/Reducer';
import selector from '../src/Selector';
import thunk from '../src/Thunk';

const initialState = {
  names: []
};

function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case 'ADD_PERSON':
      //the BUG is remarked now
      //state.names.push(action.addedName);
      //return state;
      return {...state, names: state.names.concat([action.addedName])};
    default:
      return state;
  }
}

describe('reducer bug', () => {
  it('should not mutate state', () => {
    const action = {type: 'ADD_PERSON', addedName: 'John'};
    const result = {names: ['John']};
    reducer(reduce).expect(action).toReturnState(result);
  });
});

function getReverseNames(state) {
  //the BUG is remarked now
  //return state.names.reverse();
  return _.reverse(_.cloneDeep(state.names));
}

describe('selector bug', () => {
  it('should not mutate state', () => {
    const state = {names: ['John', 'Rob']};
    const result = ['Rob', 'John'];
    selector(getReverseNames).expect(state).toReturn(result);
  });
});

function reversePostsThunk() {
  return async function(dispatch, getState) {
    const state = getState();
    //the BUG is remarked now
    //const reversePosts = _.reverse(state.posts);
    const reversePosts = _.reverse(_.cloneDeep(state.posts));
    dispatch({type: 'UPDATE_POSTS', posts: reversePosts});
  };
}

describe('thunk bug', () => {
  it('should not mutate state', async () => {
    const state = {posts: ['post1', 'post2']};
    const dispatches = await thunk(reversePostsThunk).withState(state).execute();
    expect(dispatches.length).toBe(1);
    expect(dispatches[0].getType()).toEqual('UPDATE_POSTS');
  });
});

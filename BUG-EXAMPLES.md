# Bug Examples

An assortment of easy to miss bugs that this library would find for you.

<br>

## Reducer

Can you spot the bug here:

```js
const initialState = {
  names: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case 'ADD_PERSON':
      state.names.push(action.addedName);
      return state;
    default:
      return state;
  }
}
```

Writing the following test will find it:

```js
import { Reducer } from 'redux-testkit';
import uut from '../reducer';

describe('person reducer', () => {

  it('should handle ADD_PERSON action', () => {
    const action = { type: 'ADD_PERSON', addedName: 'John' };
    const result = { names: ['John'] };
    Reducer(uut).expect(action).toReturnState(result);
  });

});

```

Answer: The reducer mutates the state.

<br>

## Selector

Can you spot the bug here:

```js
const initialState = {
  names: ['John', 'Rob']
};

export function getReverseNames(state) {
  return state.names.reverse();
}
```

Writing the following test will find it:

```js
import { Selector } from 'redux-testkit';
import * as uut from '../reducer';

describe('person selectors', () => {

  it('should return a reverse list of names', () => {
    const state = { names: ['John', 'Rob'] }
    const result = ['Rob', 'John'];
    Selector(uut.getReverseNames).expect(state).toReturnState(result);
  });

});

```

Answer: The selector mutates the state.

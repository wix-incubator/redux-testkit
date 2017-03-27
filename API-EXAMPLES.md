# API Examples

## Reducer

### `Reducer(reducer, state).expect(action).toReturnState(result)`

```js
import { Reducer } from 'redux-testkit';
import uut from '../reducer';

describe('counter reducer', () => {

  it('should handle INCREMENT action on initial state', () => {
    const action = { type: 'INCREMENT' };
    const result = { counter: 1 };
    Reducer(uut).expect(action).toReturnState(result);
  });

  it('should handle INCREMENT action on existing state', () => {
    const action = { type: 'INCREMENT' };
    const state = { counter: 1 };
    const result = { counter: 2 };
    Reducer(uut, state).expect(action).toReturnState(result);
  });

  it('should handle COMPLEX action on complex state', () => {
    const initialState = uut();
    const action = { type: 'COMPLEX' };
    const state = { ...initialState, value: 'before' };
    const result = { ...initialState, value: 'after' };
    Reducer(uut, state).expect(action).toReturnState(result);
  });

});
```

<br>

### `Reducer(reducer, state).expect(action).toChangeInState(changes)`

```js
import { Reducer } from 'redux-testkit';
import uut from '../reducer';

describe('person reducer', () => {

  it('should handle UPDATE_NAME action and only check that name changed', () => {
    const action = { type: 'UPDATE_NAME', newName: 'John' };
    const state = { person: { name: 'Bill', age: 35, height: 1.85 } };
    const changes = { person: { name: 'John' } };
    Reducer(uut, state).expect(action).toChangeInState(changes);
  });

});
```

<br>

### `Reducer(reducer, state).execute(action)`

```js
import { Reducer } from 'redux-testkit';
import uut from '../reducer';

describe('movies reducer', () => {

  it('should handle ADD_MOVIE action on existing state with custom expectations', () => {
    const action = { type: 'ADD_MOVIE', name: 'Frozen' };
    const state = { movies: [] };
    const result = Reducer(uut, state).execute(action);
    expect(result.movies.length).toEqual(1);
    expect(result.movies).toContain('Frozen');
  });

});
```

<br>

## Selector

### `Selector(selector).expect(state, ...args).toReturn(result)`

```js
import { Selector } from 'redux-testkit';
import * as uut from '../reducer';

describe('numbers selectors', () => {

  it('should select integers from numbers state', () => {
    const state = { numbers: [1, 2.2, 3.14, 4, 5.75, 6] };
    const result = [1, 4, 6];
    Selector(uut.getIntegers).expect(state).toReturn(result);
  });

});

```

<br>

### `Selector(selector).execute(state, ...args)`

```js
import { Selector } from 'redux-testkit';
import * as uut from '../reducer';

describe('numbers selectors', () => {

  it('should select integers from numbers state', () => {
    const state = { numbers: [1, 2.2, 3.14, 4, 5.75, 6] };
    const result = Selector(uut.getIntegers).execute(state);
    expect(result.length).toEqual(3);
    expect(result).toContain(4);
  });

});

```

<br>

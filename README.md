# redux-testkit
##Testkit for redux thunks

### Installation

Install this module via npm with `npm install redux-testkit --save-dev`

### Description

Use this module to easily write **unit tests** for redux actions, including asynchronous actions using [redux-thunk](https://github.com/gaearon/redux-thunk) middleware.

### Usage

To import the module in your test file, use 
`import {MockStore} from 'redux-testkit';` 

MockStore provides these methods:

#### reset()

Simply resets the store, usually you would use this in `beforeEach` or equivalent in your test suite, for example

```
beforeEach(() => {
    mockStore.reset();
});
```

#### setState(newState)

This sets the redux store state that will be provided via `getState` to thunks dispatched to the mockStore. Use this to set up a test that depends on an existing state.

**Important note: This object is NOT affected by dispatches, or internal dispatches called in tests. This shouldn't cause any problems because thinks _should not rely on the reducer logic_ but should only 'fire and forget' events to the store**

#### dispatchSync(action)

This is the key method for running your tests. Say your thunk is:

```
export function actionToTest(parameters) {
  return async function(dispatch, getState) {
    //Asynchronous logic with lots of awaits here
  }
}
```
then you send this to the mockStore with `mockStore.dispatchSync(actionToTest(paramObjects));`.

The testkit will run this test **synchronously** and then you can run `expect` asertations on the output with:

#### getActions()

This is where you do the work in the tests. To unit test an action, you want to test what effect the action has given a specific starting environment. We set up this environment before the test with `setState()` and by passing parameters. There are three ways a dispatched action can cause effects:

1. By dispatching an object with a `type` field to the store
2. By dispatching another action to the store
3. By calling some external function 

In case 3, you test the effect by mocking the external function. Typically you would extract that logic to a separate class and import it into your action's class, and so you mock it by using a tool like `proxyquire` when importing you actions into the test suite.

redux-testkit allows you to *unit test* cases 1 and 2.

`getActions()` returns an `array` of all the dispatches sent by the tested action, in order. In case 1, the entire object is saved and you can `expect` it to have a type and other fields, for example:

```
expect(mockStore.getActions()[0].type).toEqual(actionTypes.ACTION_TYPE_1);
expect(mockStore.getActions()[0].otherField).toEqual({some object});
```

In case 2, the `name` of the dispatched function is saved, and can be tested like this

```
expect(mockStore.getActions()[1]).toEqual('name_of_function');
```

**If this is another thunk, then you must name the internal anonymous async function, like this:**

```
export function name_of_function() {
  return async function name_of_function(dispatch, getState) {
  }
}
```

To test a **synchronous** action that dispacthes other actions or objects, you should inject the `mockDispatch()` and `getState()` from the mockStore. For example:

```
const result = actions.syncAction(mockStore.mockDispatch, mockStore.getState(), params...);
expect(result).toEqual(123456);
expect(mockStore.getActions()).to....
```

## TODO
[ ] Improve syntax with Matchers - Please open issues to suggest the syntax you'd want!

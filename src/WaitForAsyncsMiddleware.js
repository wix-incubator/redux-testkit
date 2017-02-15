let pendingPromises = [];

export function createMiddleware() {
  reset();
  return () => {
    return (next) => (action) => {
      let returnValue;
      if (typeof action === 'function') {
        const actionWrapper = (...args) => {
          const result = action(...args);

          if (result && result.then && typeof result.then === 'function') {
            pendingPromises.push(result);
          }
          return result;
        };
        returnValue = next(actionWrapper);
      } else {
        returnValue = next(action);
      }

      return returnValue;
    };
  };
}

export function reset() {
  pendingPromises = [];
}

export async function waitForPendingAsyncs() {
  const promisesCount = pendingPromises.length;
  if (promisesCount > 0) {
    await Promise.all(pendingPromises);
    // remove resolved promises
    pendingPromises = pendingPromises.slice(promisesCount);
    await waitForPendingAsyncs();
  }
}

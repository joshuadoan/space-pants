function createPromise(
  func: (resolve: (value: any) => void, reject: (reason?: any) => void) => void
) {
  return {
    then: (
      onFulfilled: (value: any) => void,
      onRejected: (reason?: any) => void
    ) => {
      func(onFulfilled, onRejected);
    },
  };
}

const promise = createPromise((resolve, reject) => {
  resolve("Hello, world!");
});

promise.then(
  (value) => {
    setTimeout(() => {
      console.log(value);
    }, 1000);
  },
  (reason) => {
    console.log(reason);
  }
);

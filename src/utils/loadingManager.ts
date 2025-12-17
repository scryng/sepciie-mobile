let incrementFn: () => void = () => {};
let decrementFn: () => void = () => {};

export const registerLoadingHandlers = (increment: () => void, decrement: () => void) => {
  incrementFn = increment;
  decrementFn = decrement;
};

export const loadingManager = {
  start: () => incrementFn(),
  stop: () => decrementFn(),
};

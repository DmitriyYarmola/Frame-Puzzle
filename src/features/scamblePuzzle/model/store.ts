import { createApi, createStore } from "effector";

export const $solvedPuzzlesCount = createStore(0);

export const solverPuzzlesAPI = createApi($solvedPuzzlesCount, {
  increment: (value) => value + 1,
  decrement: (value) => value - 1,
});

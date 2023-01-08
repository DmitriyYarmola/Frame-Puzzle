import { createStore } from "effector";
import { Puzzle } from "../lib";

export const $puzzles = createStore<Puzzle[]>([]);

export const $selectedPuzzle = createStore<null | Puzzle>(null);

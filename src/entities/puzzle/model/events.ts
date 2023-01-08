import { createEvent } from "effector";
import { $selectedPuzzle } from "./stores";

export const resetPuzzle = createEvent();

$selectedPuzzle.reset(resetPuzzle);

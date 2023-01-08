import { createEvent } from "effector";
import { $isGameStarted } from "./stores";

export const toggleGameStarted = createEvent();

$isGameStarted.on(toggleGameStarted, (value) => !value);

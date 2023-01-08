import { createEvent } from "effector";
import { $canvas } from "./stores";

export const saveWorkingCanvas = createEvent<HTMLCanvasElement | null>();

$canvas.on(saveWorkingCanvas, (_, data) => data);

import { createEvent, sample } from "effector";
import { $canvas } from "@entities/canvas/model/stores";

export const saveWorkingCanvas = createEvent<HTMLCanvasElement | null>();

$canvas.on(saveWorkingCanvas, (_, data) => data);

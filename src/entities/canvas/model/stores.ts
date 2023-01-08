import { createApi, createStore } from "effector";

export const $canvas = createStore<HTMLCanvasElement | null>(null);

export const canvasAPI = createApi($canvas, {
  set: (_, canvas: HTMLCanvasElement | null) => canvas,
  clear: (canvas) => {
    if (!canvas) return null;

    const context = canvas.getContext("2d");

    if (!context) return null;

    context.clearRect(0, 0, canvas.width, canvas.height);
  },
});

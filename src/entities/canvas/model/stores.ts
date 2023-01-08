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
  draw: (canvas, { puzzles, image }) => {
    if (!canvas) return null;

    const context = canvas.getContext("2d");

    if (!context) return null;

    for (let i = 0; i < puzzles.length; i++) {
      const puzzle = puzzles[i];
      const { x, y, width, height, currentXPosition, currentYPosition } = puzzle.draw();

      const path = new Path2D();

      path.rect(currentXPosition, currentYPosition, width, height);

      context.save();

      context.clip(path);

      context.drawImage(
        image,
        x,
        y,
        width,
        height,
        currentXPosition,
        currentYPosition,
        width,
        height
      );

      context.restore();
      context.stroke(path);
    }
  },
});

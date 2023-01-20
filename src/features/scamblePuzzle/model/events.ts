import { createEvent, forward, sample } from "effector";
import {
  canvasModel,
  transformCanvasCoordinatesToRelativeCoordinates,
  gameSettingsModel,
  Puzzle,
  puzzleModel,
  findPuzzleByCoordinates,
  definePuzzleEdges,
  definePuzzleSockets,
} from "@puzzleFrame/entities";
import { Coordinates } from "@shared/interfaces";
import { drawPuzzleSides } from "../lib";

export const generatePuzzles = createEvent();

export const redrawPuzzles = createEvent();

sample({
  clock: generatePuzzles,
  source: {
    settings: gameSettingsModel.$gameSettings,
  },
  filter: ({ settings: { imageInformation } }) => Boolean(imageInformation),
  fn: ({ settings: { cols, rows, imageInformation } }) => {
    const puzzleWidth = imageInformation!.width / cols;
    const puzzleHeight = imageInformation!.height / rows;

    const puzzles: Puzzle[] = [];

    let order = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const canvasPositionX = col * puzzleWidth;
        const canvasPositionY = row * puzzleHeight;
        order = order + 1;

        const edges = definePuzzleEdges(order, rows * cols, cols);
        const sockets = definePuzzleSockets(edges, order, cols, rows);

        const puzzle = new Puzzle(
          order,
          puzzleWidth,
          puzzleHeight,
          {
            x: canvasPositionX,
            y: canvasPositionY,
          },
          edges
        );

        puzzles.push(puzzle);
      }
    }

    return puzzles;
  },
  target: puzzleModel.$puzzles,
});

forward({
  from: puzzleModel.$puzzles,
  to: redrawPuzzles,
});

sample({
  clock: redrawPuzzles,
  source: {
    canvas: canvasModel.$canvas,
    puzzles: puzzleModel.$puzzles,
    settings: gameSettingsModel.$gameSettings,
  },
  fn: ({ canvas, puzzles, settings: { imageInformation: image } }) => {
    if (!canvas || !image) return null;

    const context = canvas.getContext("2d");

    if (!context) return null;

    for (let i = 0; i < puzzles.length; i++) {
      const puzzle = puzzles[i];
      const { x, y, width, height, currentXPosition, currentYPosition, edges } =
        puzzle.getDrawInformation();

      const path = new Path2D();

      drawPuzzleSides(path, width, height, currentXPosition, currentYPosition, edges);

      context.fill();
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

export const onGrabPuzzle = createEvent<Coordinates>();

sample({
  clock: onGrabPuzzle,
  source: { canvas: canvasModel.$canvas, puzzles: puzzleModel.$puzzles },
  filter: ({ canvas }) => Boolean(canvas),
  fn: ({ canvas, puzzles }, { x, y }) => {
    const { canvasRelativeX, canvasRelativeY } =
      transformCanvasCoordinatesToRelativeCoordinates(canvas!, x, y);

    const { puzzle, index } = findPuzzleByCoordinates(
      puzzles,
      canvasRelativeX,
      canvasRelativeY
    );

    if (!puzzle) return null;

    const cutPuzzle = puzzles.splice(index, 1)[0];

    cutPuzzle.setPuzzleClickDeviation(canvasRelativeX, canvasRelativeY);

    puzzles.push(cutPuzzle);

    return puzzle;
  },
  target: puzzleModel.$selectedPuzzle,
});

export const onMovePuzzle = createEvent<Coordinates>();

//Note: we must clear the canvas before redrawing puzzles
sample({
  clock: onMovePuzzle,
  source: puzzleModel.$selectedPuzzle,
  filter: (puzzle) => Boolean(puzzle),
  target: canvasModel.canvasAPI.clear,
});

sample({
  clock: onMovePuzzle,
  source: {
    canvas: canvasModel.$canvas,
    puzzle: puzzleModel.$selectedPuzzle,
    puzzles: puzzleModel.$puzzles,
    settings: gameSettingsModel.$gameSettings,
  },
  filter: ({ puzzle, canvas }) => Boolean(canvas) && Boolean(puzzle),
  fn: ({ canvas, puzzle, puzzles, settings: { imageInformation } }, { x, y }) => {
    const { canvasRelativeX, canvasRelativeY } =
      transformCanvasCoordinatesToRelativeCoordinates(canvas!, x, y);

    puzzle!.move(canvasRelativeX, canvasRelativeY);

    return { image: imageInformation, puzzles };
  },
  target: redrawPuzzles,
});

export const onDropPuzzle = createEvent();

sample({
  clock: onDropPuzzle,
  source: { puzzle: puzzleModel.$selectedPuzzle },
  filter: ({ puzzle }) => Boolean(puzzle),
  fn: ({ puzzle }) => {
    puzzle!.resetPuzzleClickDeviation();
  },
  target: puzzleModel.resetPuzzle,
});

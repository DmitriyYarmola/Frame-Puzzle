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
import { getPuzzleCutSizes } from "@entities/puzzle";
import { generateRandomNumber } from "@shared/lib";
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
    const { width, height } = imageInformation!;
    const puzzleWidth = width / cols;
    const puzzleHeight = height / rows;

    const puzzles: Puzzle[] = [];

    let order = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const canvasPositionX = col * puzzleWidth;
        const canvasPositionY = row * puzzleHeight;
        order = order + 1;

        const sockets = definePuzzleSockets(order, cols, rows);

        const randomXPosition = generateRandomNumber(0, width);
        const randomYPosition = generateRandomNumber(0, height);
        //TODO: Proceed the case when a puzzle has right/bottom outside socket
        const currentPosition = {
          x:
            randomXPosition + puzzleWidth > width ? width - puzzleWidth : randomXPosition,
          y:
            randomYPosition + puzzleHeight > height
              ? height - puzzleHeight
              : randomYPosition,
        };

        const puzzle = new Puzzle(
          order,
          puzzleWidth,
          puzzleHeight,
          {
            x: canvasPositionX,
            y: canvasPositionY,
          },
          currentPosition,
          sockets
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
      const { x, y, width, height, currentXPosition, currentYPosition, sockets } =
        puzzle.getDrawInformation();

      const path = new Path2D();

      drawPuzzleSides(path, width, height, currentXPosition, currentYPosition, sockets);

      context.fill();
      context.save();

      context.clip(path);

      const { additionalWidth, additionalHeight, xDeviation, yDeviation } =
        getPuzzleCutSizes(sockets);

      context.drawImage(
        image,
        x - xDeviation,
        y - yDeviation,
        width + additionalWidth,
        height + additionalHeight,
        currentXPosition - xDeviation,
        currentYPosition - yDeviation,
        width + additionalWidth,
        height + additionalHeight
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

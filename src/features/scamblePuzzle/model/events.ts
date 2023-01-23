import { createEvent, forward, sample, split } from "effector";
import {
  canvasModel,
  transformCanvasCoordinatesToRelativeCoordinates,
  gameSettingsModel,
  Puzzle,
  puzzleModel,
  findPuzzleByCoordinates,
  definePuzzleSockets,
  checkIfPuzzleIsInRightPosition,
  audioModel,
} from "@puzzleFrame/entities";
import { Coordinates } from "@shared/interfaces";
import { getPuzzleCutSizes } from "@entities/puzzle";
import { generateRandomNumber } from "@shared/lib";
import { drawPuzzleSides } from "../lib";
import { $solvedPuzzlesCount, solverPuzzlesAPI } from "./store";

export const createBoard = createEvent();

export const redrawPuzzles = createEvent();

export const onDropPuzzle = createEvent();

export const refreshBoard = createEvent();

export const onMovePuzzle = createEvent<Coordinates>();

sample({
  clock: createBoard,
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
        //TODO: Proceed the case when a puzzle has right/bottom outside a socket
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
  fn: ({
    canvas,
    puzzles,
    settings: { imageInformation: image, puzzleCurvePoint, puzzleSideSize },
  }) => {
    if (!canvas || !image) return null;

    const context = canvas.getContext("2d");

    if (!context) return null;

    for (let i = 0; i < puzzles.length; i++) {
      const puzzle = puzzles[i];
      const {
        x,
        y,
        width,
        height,
        currentXPosition,
        currentYPosition,
        sockets,
        verticalSockets,
        horizontalSockets,
      } = puzzle.getDrawInformation();

      puzzle.currentIndex = i;
      const path = new Path2D();

      drawPuzzleSides(
        path,
        width,
        height,
        currentXPosition,
        currentYPosition,
        sockets,
        puzzleCurvePoint,
        puzzleSideSize
      );

      context.fill();
      context.save();

      context.clip(path);

      const { additionalWidth, additionalHeight, xDeviation, yDeviation } =
        getPuzzleCutSizes(sockets, verticalSockets, horizontalSockets);

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

//Note: we must clear the canvas before redrawing puzzles
sample({
  clock: [onMovePuzzle, onDropPuzzle],
  source: {
    puzzle: puzzleModel.$selectedPuzzle,
    canvas: canvasModel.$canvas,
    settings: gameSettingsModel.$gameSettings,
  },
  filter: ({ puzzle, canvas }) => Boolean(canvas) && Boolean(puzzle),
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

const puzzlePlacedSuccess = createEvent();
const puzzlePlacedFail = createEvent();

split({
  source: sample({
    clock: onDropPuzzle,
    source: { puzzle: puzzleModel.$selectedPuzzle },
    filter: ({ puzzle }) => Boolean(puzzle),
    fn: ({ puzzle }) => {
      puzzle!.resetPuzzleClickDeviation();

      return {
        isCorrect: checkIfPuzzleIsInRightPosition(puzzle!),
        previouslyCorrect: puzzle!.isSolved,
      };
    },
  }),
  match: {
    correct: ({ isCorrect }) => isCorrect,
    incorrect: ({ isCorrect, previouslyCorrect }) => previouslyCorrect && !isCorrect,
    neutral: ({ isCorrect, previouslyCorrect }) => !previouslyCorrect && !isCorrect,
  },
  cases: {
    correct: puzzlePlacedSuccess,
    incorrect: puzzlePlacedFail,
    neutral: refreshBoard,
  },
});

sample({
  clock: puzzlePlacedFail,
  source: { puzzle: puzzleModel.$selectedPuzzle },
  fn: ({ puzzle }) => {
    if (puzzle!.isSolved) {
      puzzle!.setIsSolved(false);
    }
  },
  target: [solverPuzzlesAPI.decrement, refreshBoard],
});

sample({
  clock: puzzlePlacedSuccess,
  source: { puzzle: puzzleModel.$selectedPuzzle, puzzles: puzzleModel.$puzzles },
  fn: ({ puzzle, puzzles }) => {
    puzzle!.setIsSolved(true);
    puzzle!.replaceCurrentWithInitialCoordinates();

    if (!puzzle) return null;

    const cutPuzzle = puzzles.splice(puzzle.currentIndex, 1)[0];

    puzzles.unshift(cutPuzzle);
  },
  target: [audioModel.audioAPI.play, solverPuzzlesAPI.increment, refreshBoard],
});

sample({
  clock: $solvedPuzzlesCount,
  source: { puzzles: puzzleModel.$puzzles },
  filter: ({ puzzles }, solvedCount) =>
    puzzles.length !== 0 && puzzles.length === solvedCount,
  fn: () => {
    console.log("CONGRATULATIONS. THE GAME HAS BEEN COMPLETED!");
  },
});

forward({
  from: refreshBoard,
  to: [redrawPuzzles, puzzleModel.resetPuzzle],
});

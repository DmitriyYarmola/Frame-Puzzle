import { createEvent, sample } from "effector";
import {
  canvasModel,
  transformCanvasCoordinatesToRelativeCoordinates,
  gameSettingsModel,
  Puzzle,
  puzzleModel,
  findPuzzleByCoordinates,
} from "@puzzleFrame/entities";
import { Coordinates } from "@shared/interfaces";

export const generatePuzzles = createEvent();

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

        const puzzle = new Puzzle(order, puzzleWidth, puzzleHeight, {
          x: canvasPositionX,
          y: canvasPositionY,
        });
        puzzles.push(puzzle);
      }
    }

    return puzzles;
  },
  target: puzzleModel.$puzzles,
});

sample({
  clock: puzzleModel.$puzzles,
  source: {
    settings: gameSettingsModel.$gameSettings,
    puzzles: puzzleModel.$puzzles,
  },
  fn: ({ settings: { imageInformation }, puzzles }) => ({
    image: imageInformation,
    puzzles,
  }),
  target: canvasModel.canvasAPI.draw,
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
  target: canvasModel.canvasAPI.draw,
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

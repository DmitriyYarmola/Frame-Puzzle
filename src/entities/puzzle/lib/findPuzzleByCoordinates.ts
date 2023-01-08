import { isPuzzleGrabbed } from "@entities/puzzle";
import { Puzzle } from "./createPuzzleInstance";

export const findPuzzleByCoordinates = (
  puzzles: Puzzle[],
  canvasX: number,
  canvasY: number
) => {
  const matchedPuzzles: Puzzle[] = [];
  let index = 0;

  for (let i = 0; i < puzzles.length; i++) {
    const puzzle = puzzles[i];
    const { x: endX, y: endY } = puzzle.getEndCoordinate();
    const { x: startX, y: startY } = puzzle.getCurrentCoordinates();

    if (isPuzzleGrabbed(canvasX, canvasY, startX, startY, endX, endY)) {
      matchedPuzzles.push(puzzle);
      index = i;
    }
  }

  return { puzzle: matchedPuzzles[matchedPuzzles.length - 1] || null, index };
};

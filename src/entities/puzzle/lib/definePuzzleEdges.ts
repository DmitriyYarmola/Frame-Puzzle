import { PuzzleEdges } from "../interfaces";

export const definePuzzleEdges = (order: number, totalPuzzles: number, cols: number) => {
  const puzzlePositionToSide = Math.ceil(order / 5) * 5 - order + 1;

  const edges: PuzzleEdges = [];

  if (order <= cols) {
    edges.push("top");
  }

  if (puzzlePositionToSide === 1) {
    edges.push("right");
  }

  if (order > totalPuzzles - cols) {
    edges.push("bottom");
  }

  if (puzzlePositionToSide === cols) {
    edges.push("left");
  }

  return edges;
};

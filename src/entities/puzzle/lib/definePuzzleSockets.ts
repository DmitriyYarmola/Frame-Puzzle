import { PuzzleEdges, PuzzleSockets } from "@entities/puzzle";
import { generateRandomNumber } from "@shared/lib";

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

  if (edges.length === 0) {
    edges.push("center");
  }

  return edges;
};

export const generateSideSocket = () => {
  const number = generateRandomNumber(0, 1);

  return (["inside", "outside"] as const)[number];
};

const oppositeSockets = {
  inside: "outside",
  outside: "inside",
} as const;

const storedPuzzlesSockets: { [key: string]: PuzzleSockets } = {};

export const definePuzzleSockets = (order: number, cols: number, rows: number) => {
  const edges = definePuzzleEdges(order, rows * cols, cols);
  const sockets: PuzzleSockets = [];

  const columnNeighbour = !edges.includes("top") ? storedPuzzlesSockets[order - 5] : null;
  const rowNeighbour = !edges.includes("left") ? storedPuzzlesSockets[order - 1] : null;

  if (!rowNeighbour) {
    sockets[1] = generateSideSocket();
    sockets[3] = null;
  }

  if (rowNeighbour) {
    const neighbourRightSocket = rowNeighbour[1];
    if (neighbourRightSocket) sockets[3] = oppositeSockets[neighbourRightSocket];

    sockets[1] = order % cols !== 0 ? generateSideSocket() : null;
  }

  if (!columnNeighbour) {
    sockets[2] = generateSideSocket();
    sockets[0] = null;
  }

  if (columnNeighbour) {
    const neighbourBottomSocket = columnNeighbour[2];

    if (neighbourBottomSocket) {
      sockets[0] = oppositeSockets[neighbourBottomSocket];
    }

    sockets[2] = order <= cols * rows - cols ? generateSideSocket() : null;
  }

  storedPuzzlesSockets[order] = sockets;

  return sockets;
};

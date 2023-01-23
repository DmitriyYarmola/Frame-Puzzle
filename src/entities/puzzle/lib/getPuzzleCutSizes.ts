import { PuzzleSockets } from "@entities/puzzle";

export const getPuzzleCutSizes = (
  sockets: PuzzleSockets,
  verticalSockets: PuzzleSockets,
  horizontalSockets: PuzzleSockets
) => ({
  additionalWidth: horizontalSockets.length * 50,
  additionalHeight: verticalSockets.length * 50,
  xDeviation: sockets[3] === "outside" ? 50 : 0,
  yDeviation: sockets[0] === "outside" ? 50 : 0,
});

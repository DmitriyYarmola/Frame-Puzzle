import { PuzzleSockets } from "@entities/puzzle";

export const getPuzzleCutSizes = (sockets: PuzzleSockets) => {
  const horizontalSockets = [sockets[1], sockets[3]].filter((socket) => socket);
  const verticalSockets = [sockets[0], sockets[2]].filter((socket) => socket);

  return {
    additionalWidth: horizontalSockets.length * 50,
    additionalHeight: verticalSockets.length * 50,
    xDeviation: sockets[3] === "outside" ? 50 : 0,
    yDeviation: sockets[0] === "outside" ? 50 : 0,
  };
};

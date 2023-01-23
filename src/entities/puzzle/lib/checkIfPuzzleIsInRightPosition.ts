import { Puzzle } from "@entities/puzzle";

const THRESHOLD = 15;

const checkCoordinate = (puzzle: Puzzle) => {
  const initialCoordinates = puzzle.getInitialCoordinates();
  const currentCoordinates = puzzle.getCurrentCoordinates();

  return (coordinate: "x" | "y") =>
    (currentCoordinates[coordinate] <= initialCoordinates[coordinate] + THRESHOLD &&
      currentCoordinates[coordinate] >= initialCoordinates[coordinate]) ||
    (currentCoordinates[coordinate] >= initialCoordinates[coordinate] - THRESHOLD &&
      currentCoordinates[coordinate] <= initialCoordinates[coordinate]);
};

export const checkIfPuzzleIsInRightPosition = (puzzle: Puzzle) => {
  const verifyCoordinatePosition = checkCoordinate(puzzle);

  return verifyCoordinatePosition("x") && verifyCoordinatePosition("y");
};

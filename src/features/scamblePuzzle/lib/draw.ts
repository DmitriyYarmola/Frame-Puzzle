import { PuzzleEdges } from "@entities/puzzle";

const CURVE_CONTROL_POINT = 50;
const PUZZLE_SIDE_HALF = 18;

const drawPuzzleSide =
  (path: Path2D) =>
  (
    x1l: number,
    y1l: number,
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x2: number,
    y2: number,
    x2l: number,
    y2l: number
  ) => {
    path.lineTo(x1l, y1l);
    path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    path.lineTo(x2l, y2l);
  };

export const drawPuzzleSides = (
  path: Path2D,
  width: number,
  height: number,
  currentXPosition: number,
  currentYPosition: number,
  edges: PuzzleEdges
) => {
  const draw = drawPuzzleSide(path);

  path.moveTo(currentXPosition, currentYPosition);

  if (edges.includes("top")) {
    path.lineTo(currentXPosition + width, currentYPosition);
  } else {
    draw(
      currentXPosition + width / 2 - PUZZLE_SIDE_HALF,
      currentYPosition,
      currentXPosition + width / 2 - CURVE_CONTROL_POINT,
      currentYPosition + CURVE_CONTROL_POINT,
      currentXPosition + width / 2 + CURVE_CONTROL_POINT,
      currentYPosition + CURVE_CONTROL_POINT,
      currentXPosition + width / 2 + PUZZLE_SIDE_HALF,
      currentYPosition,
      currentXPosition + width,
      currentYPosition
    );
  }

  if (edges.includes("right")) {
    path.lineTo(currentXPosition + width, currentYPosition + height);
  } else {
    draw(
      currentXPosition + width,
      currentYPosition + height / 2 - PUZZLE_SIDE_HALF,
      currentXPosition + width - CURVE_CONTROL_POINT,
      currentYPosition + height / 2 - CURVE_CONTROL_POINT,
      currentXPosition + width - CURVE_CONTROL_POINT,
      currentYPosition + height / 2 + CURVE_CONTROL_POINT,
      currentXPosition + width,
      currentYPosition + height / 2 + PUZZLE_SIDE_HALF,
      currentXPosition + width,
      currentYPosition + height
    );
  }

  if (edges.includes("bottom")) {
    path.lineTo(currentXPosition, currentYPosition + height);
  } else {
    draw(
      currentXPosition + width / 2 + PUZZLE_SIDE_HALF,
      currentYPosition + height,
      currentXPosition + width / 2 + CURVE_CONTROL_POINT,
      currentYPosition + height - CURVE_CONTROL_POINT,
      currentXPosition + width / 2 - CURVE_CONTROL_POINT,
      currentYPosition + height - CURVE_CONTROL_POINT,
      currentXPosition + width / 2 - PUZZLE_SIDE_HALF,
      currentYPosition + height,
      currentXPosition,
      currentYPosition + height
    );
  }

  if (edges.includes("left")) {
    path.lineTo(currentXPosition, currentYPosition);
  } else {
    draw(
      currentXPosition,
      currentYPosition + height / 2 + PUZZLE_SIDE_HALF,
      currentXPosition + CURVE_CONTROL_POINT,
      currentYPosition + height / 2 + CURVE_CONTROL_POINT,
      currentXPosition + CURVE_CONTROL_POINT,
      currentYPosition + height / 2 - CURVE_CONTROL_POINT,
      currentXPosition,
      currentYPosition + height / 2 - PUZZLE_SIDE_HALF,
      currentXPosition,
      currentYPosition
    );
  }
};

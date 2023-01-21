import { PuzzleSockets } from "@entities/puzzle";

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
  sockets: PuzzleSockets
) => {
  const draw = drawPuzzleSide(path);

  path.moveTo(currentXPosition, currentYPosition);

  if (!sockets[0]) {
    path.lineTo(currentXPosition + width, currentYPosition);
  } else {
    const isInside = sockets[0] === "inside";

    draw(
      currentXPosition + width / 2 - PUZZLE_SIDE_HALF,
      currentYPosition,
      currentXPosition + width / 2 - CURVE_CONTROL_POINT,
      isInside
        ? currentYPosition + CURVE_CONTROL_POINT
        : currentYPosition - CURVE_CONTROL_POINT,
      currentXPosition + width / 2 + CURVE_CONTROL_POINT,
      isInside
        ? currentYPosition + CURVE_CONTROL_POINT
        : currentYPosition - CURVE_CONTROL_POINT,
      currentXPosition + width / 2 + PUZZLE_SIDE_HALF,
      currentYPosition,
      currentXPosition + width,
      currentYPosition
    );
  }

  if (!sockets[1]) {
    path.lineTo(currentXPosition + width, currentYPosition + height);
  } else {
    const isInside = sockets[1] === "inside";

    draw(
      currentXPosition + width,
      currentYPosition + height / 2 - PUZZLE_SIDE_HALF,
      isInside
        ? currentXPosition + width - CURVE_CONTROL_POINT
        : currentXPosition + width + CURVE_CONTROL_POINT,
      currentYPosition + height / 2 - CURVE_CONTROL_POINT,
      currentXPosition +
        (isInside ? width - CURVE_CONTROL_POINT : width + CURVE_CONTROL_POINT),
      currentYPosition + height / 2 + CURVE_CONTROL_POINT,
      currentXPosition + width,
      currentYPosition + height / 2 + PUZZLE_SIDE_HALF,
      currentXPosition + width,
      currentYPosition + height
    );
  }

  if (!sockets[2]) {
    path.lineTo(currentXPosition, currentYPosition + height);
  } else {
    const isInside = sockets[2] === "inside";

    draw(
      currentXPosition + width / 2 + PUZZLE_SIDE_HALF,
      currentYPosition + height,
      currentXPosition + width / 2 + CURVE_CONTROL_POINT,
      currentYPosition +
        (isInside ? height - CURVE_CONTROL_POINT : height + CURVE_CONTROL_POINT),
      currentXPosition + width / 2 - CURVE_CONTROL_POINT,
      isInside
        ? currentYPosition + height - CURVE_CONTROL_POINT
        : currentYPosition + height + CURVE_CONTROL_POINT,
      currentXPosition + width / 2 - PUZZLE_SIDE_HALF,
      currentYPosition + height,
      currentXPosition,
      currentYPosition + height
    );
  }

  if (!sockets[3]) {
    path.lineTo(currentXPosition, currentYPosition);
  } else {
    const isInside = sockets[3] === "inside";

    draw(
      currentXPosition,
      currentYPosition + height / 2 + PUZZLE_SIDE_HALF,
      isInside
        ? currentXPosition + CURVE_CONTROL_POINT
        : currentXPosition - CURVE_CONTROL_POINT,
      currentYPosition + height / 2 + CURVE_CONTROL_POINT,
      isInside
        ? currentXPosition + CURVE_CONTROL_POINT
        : currentXPosition - CURVE_CONTROL_POINT,
      currentYPosition + height / 2 - CURVE_CONTROL_POINT,
      currentXPosition,
      currentYPosition + height / 2 - PUZZLE_SIDE_HALF,
      currentXPosition,
      currentYPosition
    );
  }
};

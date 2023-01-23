import { PuzzleSockets } from "@entities/puzzle";

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
  sockets: PuzzleSockets,
  curveControlPoint: number,
  puzzleSideHalf: number
) => {
  const draw = drawPuzzleSide(path);

  path.moveTo(currentXPosition, currentYPosition);

  if (!sockets[0]) {
    path.lineTo(currentXPosition + width, currentYPosition);
  } else {
    const isInside = sockets[0] === "inside";

    draw(
      currentXPosition + width / 2 - puzzleSideHalf,
      currentYPosition,
      currentXPosition + width / 2 - curveControlPoint,
      isInside
        ? currentYPosition + curveControlPoint
        : currentYPosition - curveControlPoint,
      currentXPosition + width / 2 + curveControlPoint,
      isInside
        ? currentYPosition + curveControlPoint
        : currentYPosition - curveControlPoint,
      currentXPosition + width / 2 + puzzleSideHalf,
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
      currentYPosition + height / 2 - puzzleSideHalf,
      isInside
        ? currentXPosition + width - curveControlPoint
        : currentXPosition + width + curveControlPoint,
      currentYPosition + height / 2 - curveControlPoint,
      currentXPosition +
        (isInside ? width - curveControlPoint : width + curveControlPoint),
      currentYPosition + height / 2 + curveControlPoint,
      currentXPosition + width,
      currentYPosition + height / 2 + puzzleSideHalf,
      currentXPosition + width,
      currentYPosition + height
    );
  }

  if (!sockets[2]) {
    path.lineTo(currentXPosition, currentYPosition + height);
  } else {
    const isInside = sockets[2] === "inside";

    draw(
      currentXPosition + width / 2 + puzzleSideHalf,
      currentYPosition + height,
      currentXPosition + width / 2 + curveControlPoint,
      currentYPosition +
        (isInside ? height - curveControlPoint : height + curveControlPoint),
      currentXPosition + width / 2 - curveControlPoint,
      isInside
        ? currentYPosition + height - curveControlPoint
        : currentYPosition + height + curveControlPoint,
      currentXPosition + width / 2 - puzzleSideHalf,
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
      currentYPosition + height / 2 + puzzleSideHalf,
      isInside
        ? currentXPosition + curveControlPoint
        : currentXPosition - curveControlPoint,
      currentYPosition + height / 2 + curveControlPoint,
      isInside
        ? currentXPosition + curveControlPoint
        : currentXPosition - curveControlPoint,
      currentYPosition + height / 2 - curveControlPoint,
      currentXPosition,
      currentYPosition + height / 2 - puzzleSideHalf,
      currentXPosition,
      currentYPosition
    );
  }
};

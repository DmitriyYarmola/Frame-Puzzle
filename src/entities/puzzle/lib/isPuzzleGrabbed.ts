export const isPuzzleGrabbed = (
  canvasX: number,
  canvasY: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) =>
  canvasX >= startX &&
  canvasY >= startY &&
  canvasX <= endX &&
  canvasY >= startY &&
  canvasX <= endX &&
  canvasY <= endY &&
  canvasX >= startX &&
  canvasY <= endY;

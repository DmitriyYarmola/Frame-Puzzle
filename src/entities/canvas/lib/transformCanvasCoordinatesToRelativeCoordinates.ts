export const transformCanvasCoordinatesToRelativeCoordinates = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number
) => {
  const rect = canvas!.getBoundingClientRect();
  const elementRelativeX = x - rect.left;
  const elementRelativeY = y - rect.top;

  const canvasRelativeX = (elementRelativeX * canvas!.width) / canvas!.clientWidth;
  const canvasRelativeY = (elementRelativeY * canvas!.height) / canvas!.clientHeight;

  return { canvasRelativeX, canvasRelativeY };
};

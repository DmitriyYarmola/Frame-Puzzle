export function drawImageProp(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
) {
  // get the ration
  const scaleFactorWidth = canvas.width / img.width;
  const scaleFactorHeight = canvas.height / img.height;

  // Finding the new width and height based on the scale factor
  const newWidth = img.width * scaleFactorWidth;
  const newHeight = img.height * scaleFactorHeight;

  // get the top left position of the image
  // in order to center the image within the canvas
  const x = canvas.width / 2 - newWidth / 2;
  const y = canvas.height / 2 - newHeight / 2;

  // When drawing the image, we have to scale down the image
  // width and height in order to fit within the canvas
  ctx.drawImage(img, x, y, newWidth, newHeight);
}

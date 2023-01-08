import { Coordinates } from "@shared/interfaces";

export class Puzzle {
  id: number;
  private readonly width: number;
  private readonly height: number;
  private readonly initialCanvasPosition: Coordinates;
  private currentCanvasPosition: Coordinates;
  private puzzleClickDeviation: Coordinates;

  constructor(
    id: number,
    width: number,
    height: number,
    initialCanvasPosition: Coordinates
  ) {
    this.id = id;
    this.initialCanvasPosition = initialCanvasPosition;
    this.currentCanvasPosition = initialCanvasPosition;
    this.puzzleClickDeviation = {
      x: 0,
      y: 0,
    };
    this.width = width;
    this.height = height;
  }

  draw() {
    const { x, y } = this.initialCanvasPosition;
    const { x: currentXPosition, y: currentYPosition } = this.currentCanvasPosition;

    return {
      x,
      y,
      width: this.width,
      height: this.height,
      currentXPosition,
      currentYPosition,
    };
  }

  move(x: number, y: number) {
    this.currentCanvasPosition = {
      x: x - this.puzzleClickDeviation.x,
      y: y - this.puzzleClickDeviation.y,
    };
  }

  getEndCoordinate() {
    return {
      x: this.currentCanvasPosition.x + this.width,
      y: this.currentCanvasPosition.y + this.height,
    };
  }

  getCurrentCoordinates() {
    return {
      x: this.currentCanvasPosition.x,
      y: this.currentCanvasPosition.y,
    };
  }

  setPuzzleClickDeviation(x: number, y: number) {
    this.puzzleClickDeviation = {
      x: Math.abs(this.currentCanvasPosition.x - x),
      y: Math.abs(this.currentCanvasPosition.y - y),
    };
  }

  resetPuzzleClickDeviation() {
    this.puzzleClickDeviation = {
      x: 0,
      y: 0,
    };
  }
}

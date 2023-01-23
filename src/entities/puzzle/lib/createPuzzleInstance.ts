import { Coordinates } from "@shared/interfaces";
import { PuzzleSockets } from "../interfaces";

export class Puzzle {
  id: number;
  private readonly width: number;
  private readonly height: number;
  private readonly initialCanvasPosition: Coordinates;
  private currentCanvasPosition: Coordinates;
  private puzzleClickDeviation: Coordinates;
  private readonly sockets: PuzzleSockets;
  private readonly verticalAvailableSockets: PuzzleSockets;
  private readonly horizontalAvailableSockets: PuzzleSockets;
  isSolved: boolean;

  constructor(
    id: number,
    width: number,
    height: number,
    initialCanvasPosition: Coordinates,
    currentCanvasPosition: Coordinates,
    sockets: PuzzleSockets
  ) {
    //Important: id is order number e.x: first element has id 1, the fifth element has id 5
    this.id = id;
    this.initialCanvasPosition = initialCanvasPosition;
    this.currentCanvasPosition = currentCanvasPosition;
    this.puzzleClickDeviation = {
      x: 0,
      y: 0,
    };
    this.width = width;
    this.height = height;
    this.sockets = sockets;
    this.verticalAvailableSockets = [sockets[0], sockets[2]].filter((socket) => socket);
    this.horizontalAvailableSockets = [sockets[1], sockets[3]].filter((socket) => socket);
    this.isSolved = false;
  }

  getDrawInformation() {
    const { x, y } = this.initialCanvasPosition;
    const { x: currentXPosition, y: currentYPosition } = this.currentCanvasPosition;

    return {
      x,
      y,
      width: this.width,
      height: this.height,
      currentXPosition,
      currentYPosition,
      sockets: this.sockets,
      verticalSockets: this.verticalAvailableSockets,
      horizontalSockets: this.horizontalAvailableSockets,
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

  getInitialCoordinates() {
    return {
      x: this.initialCanvasPosition.x,
      y: this.initialCanvasPosition.y,
    };
  }

  setPuzzleClickDeviation(x: number, y: number) {
    this.puzzleClickDeviation = {
      x: Math.abs(this.currentCanvasPosition.x - x),
      y: Math.abs(this.currentCanvasPosition.y - y),
    };
  }

  setIsSolved(value: boolean) {
    this.isSolved = value;
  }

  resetPuzzleClickDeviation() {
    this.puzzleClickDeviation = {
      x: 0,
      y: 0,
    };
  }

  replaceCurrentWithInitialCoordinates() {
    this.currentCanvasPosition = this.initialCanvasPosition;
  }
}

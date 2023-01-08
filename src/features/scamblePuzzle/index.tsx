import React, { MouseEvent, useCallback, useEffect } from "react";
import { useStore } from "effector-react";
import { gameSettingsModel, canvasModel } from "@puzzleFrame/entities";
import { MouseEventsTypes } from "@shared/interfaces";
import { generatePuzzles, onGrabPuzzle, onMovePuzzle, onDropPuzzle } from "./model";

export const ScramblePuzzle = () => {
  const canvas = useStore(canvasModel.$canvas);
  const puzzleImageBackgroundURL = useStore(gameSettingsModel.$gameSettings);

  useEffect(() => {
    if (canvas) {
      const img = new Image();

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        gameSettingsModel.saveGameSettings({ imageInformation: img });
        generatePuzzles();
      };

      img.src = puzzleImageBackgroundURL.image;
    }
  }, [puzzleImageBackgroundURL.image, canvas]);

  const onMouseEvent = useCallback(
    (mouseEvent: MouseEventsTypes) => (event: MouseEvent<HTMLCanvasElement>) => {
      const { clientX: x, clientY: y } = event;

      if (mouseEvent === "down") onGrabPuzzle({ x, y });
      if (mouseEvent === "move") onMovePuzzle({ x, y });
      if (mouseEvent === "up") onDropPuzzle();
    },
    []
  );

  return (
    <canvas
      className="mx-auto"
      ref={(ref) => canvasModel.canvasAPI.set(ref)}
      onMouseDown={onMouseEvent("down")}
      onMouseMove={onMouseEvent("move")}
      onMouseUp={onMouseEvent("up")}
    />
  );
};

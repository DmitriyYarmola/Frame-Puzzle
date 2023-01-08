import React from "react";
import { useStore } from "effector-react";
import { Button } from "@shared/ui";
import { gameSettingsModel } from "@puzzleFrame/entities";
import { generateRandomImageWithScreenSize } from "./model";

export const SelectImage = () => {
  const gameSettings = useStore(gameSettingsModel.$gameSettings);

  return (
    <div className="my-4 grid justify-center">
      <Button onClick={generateRandomImageWithScreenSize} type="secondary">
        Generate random image
      </Button>
      <img
        style={{ width: 640, height: 640 }}
        className={`${gameSettings.image ? "visible" : "invisible"}`}
        src={gameSettings.image}
        alt="Chosen image"
      />
    </div>
  );
};

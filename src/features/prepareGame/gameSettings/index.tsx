import React from "react";
import { Button } from "@shared/ui";
import { useStore } from "effector-react";
import { useNavigate } from "react-router-dom";
import { routes } from "@shared/configs";
import { generateRandomNumber } from "@shared/lib";
import { gameSettingsModel } from "@puzzleFrame/entities";
import { SelectImage } from "./SelectImage";

export const GameSettings = () => {
  const navigate = useNavigate();
  const gameSettings = useStore(gameSettingsModel.$gameSettings);

  const onProceedGame = () => {
    navigate(routes.puzzle(generateRandomNumber()));
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-medium">Select game settings</h3>
      <SelectImage />
      {gameSettings.image && (
        <Button onClick={onProceedGame}>Proceed to puzzle scrambling</Button>
      )}
    </div>
  );
};

import React from "react";
import { useStore } from "effector-react";
import { Button } from "@shared/ui";
import { $isGameStarted, toggleGameStarted } from "./model";
import { GameSettings } from "./gameSettings";

export const PrepareGame = () => {
  const isGameStarted = useStore($isGameStarted);

  return (
    <div className="text-center">
      {!isGameStarted ? (
        <Button onClick={toggleGameStarted}>Start a new game</Button>
      ) : (
        <GameSettings />
      )}
    </div>
  );
};

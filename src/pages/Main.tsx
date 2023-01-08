import React from "react";
import { MainTemplate } from "@shared/ui";
import { PrepareGame } from "@puzzleFrame/features";

export const MainPage = () => (
  <MainTemplate>
    <main>
      <h1 className="text-center text-4xl font-bold">Welcome to Puzzle Frame game</h1>
      <p className="mb-4 mt-4 text-center text-lg font-medium">
        Press the button below to start the game
      </p>
      <PrepareGame />
    </main>
  </MainTemplate>
);

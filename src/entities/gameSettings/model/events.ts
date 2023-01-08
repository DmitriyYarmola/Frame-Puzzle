import { createEvent } from "effector";
import { GameSettings } from "../interfaces";
import { $gameSettings } from "./stores";
import { generateImageFx } from "./effects";

export const saveGameSettings = createEvent<Partial<GameSettings>>();

$gameSettings.on(saveGameSettings, (state, data) => ({ ...state, ...data }));

$gameSettings.on(generateImageFx.doneData, (state, imageURL) => ({
  ...state,
  image: imageURL,
}));

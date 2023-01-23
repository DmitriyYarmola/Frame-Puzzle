import { createStore } from "effector";
import { GameSettings } from "../interfaces";

export const $gameSettings = createStore<GameSettings>({
  image: "",
  cols: 5,
  rows: 5,
  imageInformation: null,
  puzzleCurvePoint: 50,
  puzzleSideSize: 18,
});

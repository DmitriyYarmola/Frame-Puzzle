import { createEvent, sample } from "effector";
import { gameSettingsModel, getUserScreenSize } from "@puzzleFrame/entities";

export const generateRandomImageWithScreenSize = createEvent();

sample({
  clock: generateRandomImageWithScreenSize,
  fn: () => getUserScreenSize(),
  target: gameSettingsModel.generateImageFx,
});

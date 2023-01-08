import { createEffect } from "effector";

interface Params {
  width: number;
  height: number;
}

export const generateImageFx = createEffect(async (params: Params) => {
  try {
    const response = await fetch(`https://picsum.photos/${params.height}`);
    return response.url;
  } catch (error) {
    console.error({
      error: "Entities -> puzzleImage -> model -> effects -> generateImageFx has failed!",
      information: error,
    });
    return "";
  }
});

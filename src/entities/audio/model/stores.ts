import { createApi, createStore } from "effector";

export const $audio = createStore<HTMLAudioElement | null>(null);

export const audioAPI = createApi($audio, {
  set: (_, audio: HTMLAudioElement | null) => audio,
  play: (audio: HTMLAudioElement | null) => {
    if (!audio) return;

    audio.play();
  },
});

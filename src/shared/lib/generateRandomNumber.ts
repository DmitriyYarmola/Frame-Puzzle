export const generateRandomNumber = (min = 1, max = 100000) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

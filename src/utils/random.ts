export const getRandomId = (length: number = 36) => {
  return Math.random().toString(length);
}
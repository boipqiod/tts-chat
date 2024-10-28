export const getRandomId = (length: number = 36) => {
  return Math.random().toString().substring(2, length + 2);
};
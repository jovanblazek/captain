export const getRandomArrayElements = <T>(array: T[], count: number) => {
  const shuffled = array.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

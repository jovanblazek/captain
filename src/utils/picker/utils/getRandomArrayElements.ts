export const getRandomArrayElements = <T>(array: T[], count: number) => {
  if (count <= 0 || array.length === 0) {
    return []
  }
  const shuffled = array.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

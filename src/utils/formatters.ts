// TODO figure out the type defs
export const parseJson = <T, TDefault = undefined>(jsonString: string, defaultValue?: TDefault) => {
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return defaultValue
  }
}

import { parseJson } from '../formatters'

describe('formatters', () => {
  describe('parseJsonToArray', () => {
    it('should parse json string to array', () => {
      const inputArray = ['hello', 'there']
      const resultArray = parseJson<typeof inputArray>(JSON.stringify(inputArray))
      expect(resultArray).toStrictEqual(inputArray)

      const inputObject = {
        general: 'Kenobi',
      }
      const resultObject = parseJson<typeof inputObject>(JSON.stringify(inputObject))
      expect(resultObject).toStrictEqual(inputObject)
    })

    it('should return default value if there is an error while parsing', () => {
      const defaultResult = parseJson('General Kenobi!')
      expect(defaultResult).toStrictEqual(undefined)

      const defaultValueDefinedReult = parseJson('General Kenobi!', [])
      expect(defaultValueDefinedReult).toStrictEqual([])
    })
  })
})

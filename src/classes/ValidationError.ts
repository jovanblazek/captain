import { reduce } from 'lodash'
import { typeToFlattenedError } from 'zod'

const generateErrorMessage = <T>(errors: typeToFlattenedError<T>) =>
  reduce(
    errors.fieldErrors,
    (acc, error) => {
      if (error) {
        return [...acc, error.join('\n')]
      }
      return acc
    },
    [] as string[]
  ).join('\n')

class ValidationError<T> extends Error {
  constructor(validationResult: typeToFlattenedError<T>) {
    super(`⚠️ There was an error with your input:\n${generateErrorMessage(validationResult)}`)
  }
}

export default ValidationError

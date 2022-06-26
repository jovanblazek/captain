import clear from './clear'
import list from './list'
import pick from './pick'
import setup from './setup'

// help command is left out to avoid circular dependency
export const Commands = {
  clear,
  list,
  setup,
  pick,
}

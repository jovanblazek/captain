# Contributing to Captain
First Thanks for helping out :+1::tada: we really appreciate it :tada::+1:

The following is a set of guidelines for contributing to the project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Pull Requests
All Pull Requests are welcome but to ensure they get committed please make sure you include the following in your PR:

* Brief description of the issue
* Impacted areas of application for test focus
* Ensure that tests are updated or new tests are added to properly cover the change in question
* If dependencies on another PR, include a reference number and describe the dependency
* End all files with a newline!

## Style guides
### Git Commit Messages

* Use the imperative mood ("Add feature" not "Added feature", "Move cursor to..." not "Moves cursor to...")
* Use reasonable length to describe the change

### Linting

This project uses [Sudolabs ESLint config](https://www.npmjs.com/package/@sudolabs-io/eslint-config-sudolabs) to enforce a consistent code style.
There is a pre-commit hook that will run the linter and prevent you from committing if there are any errors.

### Tests

* Include thoughtfully-worded, well-structured [Jest](https://jestjs.io/) tests in `__tests__` folders
* The test file should have the same name as the production file
* Tests should use arrow functions and should never use `this`
* Treat `describe` as a noun or situation.
* Treat `it` as a statement about state or how an operation _should_ change state.

#### :white_check_mark:Good Example
```js
describe('GET User Route', () => {
  describe('when user found', () => {
    it('should return 200', () => {...});
    it('should return the user object', () => {...});
  });
  describe('when user not found', () => {
    it('should return 404', () => {...});
  });
});
```

#### :x:Bad Example
```js
describe('GET User Route', () => {
  it('when user found return 200', () => {...});
  it('when user not found return 404', () => {...});
  it('when user found return the user object', () => {...});
});
```

## Additional Notes

### Git Branches

* Branch names should be all lower case and use dashes to separate words
* Branch names ideally should include a description of the change to make it easier to know what each branch does without having to look up each issue. The description should be as short as possible.
 <!-- TODO add example -->
# Contributing to Captain
First off, thank you for considering contributing to Captain. We really appreciate it 🎉

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, they should reciprocate that respect by addressing your issue, assessing changes, and helping you finalize your pull requests.

## 🥇 Your First Contribution

Unsure where to begin? You can start by looking through "good first issue" issues. These are issues that should only require a few lines of code, and a test or two. 

Working on your first Pull Request? You can learn how from this free series, [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

## Setup the project

### ❗️ Prerequisites
- Node.js >= 16.12.0
- Docker
- Docker Compose
- Slack workspace (for manual testing)
- Slack app (for manual testing)

### 💻 Environment setup

1. Fork and clone the repository
2. Copy `.env.example` file to `.env` file and fill in the missing values. For slack values, refer to [Slack app setup](#slack-app-setup) section.
For Postgres values, you can use any values you want.
3. Install the dependencies with `npm install`.
4. Run `docker-compose up` to start the DB.
5. Run `npm run migrate:dev` to create the tables.
6. Run `npm run dev` to start the bot.

### 💬 Slack app setup

To try out the bot locally, you need to create a Slack app. You can do that by following the [official guide](https://api.slack.com/start/building/bolt-js). You only need to do this process once, unless the `slack-app-manifest.yml` file changes.

Here are the steps you need to follow:
1. [Create a Slack Workspace](https://slack.com/help/articles/206845317-Create-a-Slack-workspace) if you don't have one already. (We advise you to create a new one for testing purposes.)
2. [Create a Slack App](https://api.slack.com/apps?new_app=1) and choose the option "From App Manifest".
3. Copy the contents of the `slack-app-manifest.yml` file and paste it into the "App Manifest" section.
4. Finish the setup.
5. You should now find yourself in the "Basic Information" section. Install the app in your workspace.
6. Scroll down and copy your client secret to `SLACK_SIGNING_SECRET` in `.env` file.
7. Further down in the "App-Level Tokens" section, click on "Generate Token and Scopes" and generate the token with `connections:write` scope. Copy the token to `SLACK_APP_TOKEN` in `.env` file. (it should start with `xapp-`)
8. Navigate to "OAuth & Permissions" and copy the "Bot User OAuth Token" to `SLACK_BOT_TOKEN` in `.env` file. (it should start with `xoxb-`).
9. Run `npm run dev` to start the bot. 🎉

## Development

Whenever you pull changes from the `main` branch do the following to ensure you have the latest changes correctly set up: 
1. run `npm install` to install the new dependencies
2. run `npm run migrate:dev` to update the database schema
3. run `npm run generate-types` to update the Prisma types
4. check and update your development app if there have been any changes to the app manifest


### 💿 Migrations

When you want to add a new table or change an existing one, you need to create a migration file. First, modify the Prisma schema. Then create and apply the migration by running the following commands:
```
npx prisma migrate dev --name <migration-name>
npm run generate-types
```

Whenever you make changes to your Prisma schema, you need to invoke `npm run generate-types` to regenerate the types for your Prisma Client.

### 🎉 Opening a PR

- If you made changes to app permissions, events or commands, make sure to update `slack-app-manifest.yml` and mention the changes in the PR.
- If you added a new feature, add tests for it if possible.
- Ensure that build & tests pass and that there are no linting errors.

## Style guide

### Git Branches

- Branch names should be all lowercase and use dashes to separate words
- Branch names should start with the type of change being made (feature, enhancement, bugfix, etc) followed by a slash and then the name of the branch
- Branch names ideally should include a description of the change to make it easier to know what each branch does without having to look up each issue. The description should be as short as possible.

Examples: 
- `feature/dropdown-component`
- `enhancement/dropdown-component-styling`
- `bugfix/dropdown-component-overflow`

### Git Commit Messages

- Use the imperative mood ("Add feature" not "Added feature", "Move cursor to..." not "Moves cursor to...")
- Use reasonable length to describe the change

### Linting

This project uses [Sudolabs ESLint config](https://www.npmjs.com/package/@sudolabs-io/eslint-config-sudolabs) to enforce a consistent code style.
There is a pre-commit hook that will run the linter and prevent you from committing if there are any errors.

### Tests

Include thoughtfully worded, well-structured [Jest](https://jestjs.io/) tests in `__tests__` folders
- The test file should have the same name as the production file
- Tests should use arrow functions and should never use `this`
- Treat `describe` as a noun or situation.
- Treat `it` as a statement about state or how an operation _should_ change state.

#### ✅ Good Example
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

#### ❌ Bad Example
```js
describe('GET User Route', () => {
  it('when user found return 200', () => {...});
  it('when user not found return 404', () => {...});
  it('when user found return the user object', () => {...});
});
```

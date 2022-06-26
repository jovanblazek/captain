# Captain - standup host picker

## Commands

- `setup <cron string>`: setup picker in this channel
- `list`: list all the cron jobs in this channel
- `clear`: clear all the cron jobs in this channel
- `pick`: run the picker manually
- `help`: show help

## Environment Setup

1. Copy `.env.example` file to `.env` file and fill in the values.
2. Run `docker-compose up` to start the DB.
3. Install the dependencies with `npm install`.
4. Run `npm run dev` to start the bot.

## Migrations
```
npx prisma migrate dev --name init
```

Whenever you make changes to your Prisma schema in the future, you manually need to invoke `prisma generate` in order to accommodate the changes in your Prisma Client API.
 

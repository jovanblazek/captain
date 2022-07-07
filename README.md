<div align="center">
  <img src="https://cdna.artstation.com/p/assets/images/images/012/233/040/large/robert-mccoy-lrm-export-20180808-085826.jpg?1533733968" alt="logo" />
  <h1>Captain - standup host picker</h1>
</div>

<div align="center">
  <a href="https://github.com/jovanblazek/captain/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/jovanblazek/captain" alt="Badge showing the number of open issues"/>
  </a>

  <a href="https://github.com/jovanblazek/captain" target="_blank">
    <img src="https://img.shields.io/github/stars/jovanblazek/captain" alt="Badge showing the number of project stars"/>
  </a>

  <a href="https://github.com/jovanblazek/captain/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/jovanblazek/captain" alt="Badge showing the license type"/>
  </a>
</div>

## 🎯 What is Captain?
Captain is a slack bot that allows you to automatically pick a random channel member, for example to moderate daily standup meeting.

1. Add Captain to the channel
2. Setup a schedule using the `/setup` command with the CRON syntax
3. Let Captain pick a random member(s) for you
4. Optionally use the `/pick` command to pick a random member immediately

![image](https://user-images.githubusercontent.com/36740941/177776736-94c42e14-9890-45b6-9310-42d6dde907b6.png)

Captain will pick up to two human channel members in case one of them is unavailable.

> **Note** \
> Captain is currently in closed beta and is not present in slack app directory yet.

## 📡 Commands
| Command | Description |
| ------- | ----------- |
| `setup` |  Setup picker in this channel |
| `list` | List all the cron jobs in this channel |
| `clear` | Clear all the cron jobs in this channel |
| `pick` | Run the picker manually |
| `help` | Show help |

## 💻 Environment Setup

1. Copy `.env.example` file to `.env` file and fill in the values.
2. Install the dependencies with `npm install`.
3. Run `docker-compose up` to start the DB.
4. Run `npm run migrate` to create the tables.
5. Run `npm run dev` to start the bot.

## 💿 Migrations

After changing the prisma schema, create a migration using following command:


```
npx prisma migrate dev --name init
```

Whenever you make changes to your Prisma schema in the future, you manually need to invoke `prisma generate` in order to accommodate the changes in your Prisma Client API.

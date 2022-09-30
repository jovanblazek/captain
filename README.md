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

<img width="255" alt="image" src="https://user-images.githubusercontent.com/36740941/189526909-8077c27a-85fd-44df-b965-64f4ec5d4117.png">

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

## 💪 Contributing
Captain is an open source project and contributions are welcome. Please read the [contributing guidelines](CONTRIBUTING.md) before contributing.
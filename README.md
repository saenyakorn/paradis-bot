# Paradis Bot <!-- omit in toc -->

Self-hosted Slack-like Discord bot for collaborative working on Discord

# Table of Contents <!-- omit in toc -->

- [Features](#features)
  - [Channel Management](#channel-management)
  - [Basic Commands](#basic-commands)
  - [Available Commands for Public Channel](#available-commands-for-public-channel)
  - [Available Commands for Private Channel](#available-commands-for-private-channel)
  - [Available Commands for Voice Channel](#available-commands-for-voice-channel)
  - [Notification Management](#notification-management)
- [Development](#development)
- [Hosting](#hosting)

# Features

## Channel Management

Normally, everyone in the Discord server would not be able to see any channel that is created by the bot. User need to list the available public channel and join desired channels by themselves.

## Basic Commands

- [x] `/channel invite <user|role>` - Invite a user or a role to the channel. The invited user would able to read and write messages in the channel, the default notification is `All messages`
- [x] `/channel leave` - Leave the channel you are in
- [x] `/channel kick <user>` - Kick the user from the channel. The users would not be able to read or write messages in the channel anymore
- [x] `/channel archive` - Archive the channel, the users in the channel are only able to read the messages
- [x] `/channel delete` - Delete the channel

## Available Commands for Public Channel

- [x] `/channel-public create <channel-name> <category-name>?` - Create a public channel
- [x] `/channel-public seek <channel>` - Join into the channel with read-only mode, the default notification is `Only @mention`
- [x] `/channel-public join <channel>` - Join into the channel with read-write mode, the default notification is `All messages`
- [x] `/channel-public list` - List all available public channels

## Available Commands for Private Channel

- [x] `/channel-private create <channel-name> <category-name>?` - Create a private channel

## Available Commands for Voice Channel

- [x] `/channel voice-setup <channel-name> <category>?` - Setup a voice channel. When the user enter this voice channel, the bot will create another temporary voice channel and move the user into the new channel. The bot will delete the channel when the all users leave the temporary channel

## Notification Management

- [ ] `/noti list` - List all notification setting for every channel you are in
- [ ] `/noti set <notification> <channel>?` - Set the notification for the current or given channel
- [ ] `/noti pause <date|time> <channel>?` - Pause the notification util the given time, users will not receive any notification during the time

# Development

For local development, you need to follow this instructions.

1. Enter [Discord Developer Portal](https://discord.com/developers/applications) and create discord application
2. Enter `Bot` section and create a bot
3. Click `Reset Token` to get `DISCORD_TOKEN` as a secret
4. Enter `OAuth2` > `General` section, you will get the `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`
5. In this project, you need to create `.env` file from `.env.template` and fill in the secrets
6. Run `docker compose up -d` to create a PostgreSQL database
7. Run `yarn start:dev` to start the application, the application will run on [localhost:3000](http://localhost:3000) by default

# Hosting

This repositoty allow you to host this bot by your own. Basically, it's a [NestJS](https://nestjs.com/) application, I will add more information later.

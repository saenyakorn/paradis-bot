# Paradis Bot <!-- omit in toc -->

Slack-like Discord bot for collaborative working

# Table of Contents <!-- omit in toc -->

- [Features](#features)
  - [Channel Management](#channel-management)
  - [Basic Commands](#basic-commands)
  - [Available Commands for Public Channel](#available-commands-for-public-channel)
  - [Available Commands for Private Channel](#available-commands-for-private-channel)
  - [Available Commands for Voice Channel](#available-commands-for-voice-channel)
    - [Notification Management](#notification-management)
- [Plan](#plan)

# Features

## Channel Management

Normally, everyone in the Discord server would not be able to see any channel that is created by the bot. User need to list the available public channel and join desired channels by themselves.

## Basic Commands

- [x] `/channel invite <user|role>` - Invite a user or a role to the channel. The invited user would able to read and write messages in the channel, the default notification is `All messages`
- [x] `/channel leave <channel>` - Leave the channel you are in
- [x] `/channel kick <channel> <user>` - Kick the user from the channel. The users would not be able to read or write messages in the channel anymore
- [x] `/channel archive <channel>` - Archive the channel, the users in the channel are only able to read the messages
- [ ] `/channel delete <channel>` - Delete the channel

## Available Commands for Public Channel

- [x] `/channel-public create <channel-name> <category-name>?` - Create a public channel
- [x] `/channel-public seek <channel>` - Join into the channel with read-only mode, the default notification is `Only @mention`
- [x] `/channel-public join <channel>` - Join into the channel with read-write mode, the default notification is `All messages`
- [x] `/channel-public list` - List all available public channels

## Available Commands for Private Channel

- [x] `/channel-private create <channel-name> <category-name>?` - Create a private channel

## Available Commands for Voice Channel

- [x] `/channel voice setup <channel-name> <category-name>?` - Setup a voice channel. When the user enter this voice channel, the bot will create another temporary voice channel and move the user into the new channel. The bot will delete the channel when the all users leave the temporary channel

### Notification Management

- [ ] `/noti list` - List all notification setting for every channel you are in
- [ ] `/noti set <channel> <notification>` - Set the notification for the given channel
- [ ] `/noti pause <date|time>` - Pause the notification util the given time, users will not receive any notification during the pause time

# Plan

TODO

# radiant-bot

A Discord bot for Radiant Hall that lets members look up and book shared spaces via slash commands.

## Commands

- `/book` — lists all reservable spaces with booking links
- `/book <name>` — returns the availability calendar and booking link for a specific space (e.g. `/book gallery`, `/book print`, `/book ceramics`)
- `/help` — shows command usage instructions

## Setup

### Prerequisites

- Node.js 18+
- A Discord application with a bot and slash commands registered

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file:

```
PUBLIC_KEY=your_discord_app_public_key
PORT=3000
```

`PUBLIC_KEY` is found in your Discord application's General Information page.

### Registering slash commands

You'll need to register the `/book` and `/help` commands with Discord's API separately (e.g. using a one-time registration script or the Discord Developer Portal). To register the commands, run:

```bash
node register_commands.js
```

### Run

```bash
node index.js
```

The server listens on `PORT` (default `3000`) and exposes a `POST /interactions` endpoint for Discord to send interactions to.

## How it works

The bot uses Discord's HTTP interactions model — Discord sends a POST request to your server for each command, and the bot responds synchronously. There is no persistent WebSocket connection.

Verification of incoming requests is handled by `discord-interactions`' `verifyKeyMiddleware`.

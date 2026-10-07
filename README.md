# Instagram URL Replacer Bot

A Discord bot that automatically detects Instagram reel and post URLs (`www.instagram.com/reel` and `www.instagram.com/p/`) and replaces them with `www.kirkstagram.com` URLs to ensure embedding so you don't have to open the instagram app to see your friends' reels and posts.

## Features

- Monitors all messages in servers where the bot has access
- Detects Instagram reel URLs (`www.instagram.com/reel`) and post URLs (`www.instagram.com/p/`)
- Automatically replaces `www.instagram.com` with `www.kirkstagram.com` (override with the `EMBED_DOMAIN` environment variable)
- Deletes the original message (if bot has permissions) and posts the modified URL
- Ignores messages from bots to prevent loops

## Setup

1. Install dependencies:

```bash
bun install
```

2. **IMPORTANT: Enable Message Content Intent in Discord Developer Portal:**

   - Go to https://discord.com/developers/applications
   - Select your bot application
   - Go to the "Bot" section
   - Scroll down to "Privileged Gateway Intents"
   - Enable "Message Content Intent"
   - Save changes

3. Set your bot token as an environment variable:

   - Create a `.env` file with `BOT_TOKEN=your_bot_token_here`
   - Or set the environment variable in your system

4. Make sure your bot has the following permissions:
   - Read Messages
   - Send Messages
   - Manage Messages (to delete original messages)

## To run:

```bash
bun run index.ts
```

## Required Bot Intents

The bot requires the following Discord intents:

- `GatewayIntentBits.Guilds`
- `GatewayIntentBits.GuildMessages`
- `GatewayIntentBits.MessageContent` ⚠️ **Privileged Intent - Must be enabled in Developer Portal**

## Troubleshooting

### "Used disallowed intents" Error

If you get this error, it means the Message Content Intent is not enabled:

1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Navigate to the "Bot" section
4. Scroll down to "Privileged Gateway Intents"
5. Toggle ON "Message Content Intent"
6. Click "Save Changes"
7. Restart your bot

### Bot doesn't respond to messages

- Ensure the bot is invited to your server with proper permissions
- Check that the bot has "Read Messages" and "Send Messages" permissions in the channels
- Verify that the Message Content Intent is enabled (see above)

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

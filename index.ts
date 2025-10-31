import {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} from "discord.js";
import * as path from "path";
import * as fs from "fs";

export class IClient extends Client {
  commands = new Collection<string, any>();
  cooldowns = new Collection<string, Collection<string, number>>();
}

console.log("Starting Discord bot...");

const client = new IClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    activities: [
      {
        type: ActivityType.Custom,
        name: "Preparing to embed your reels",
      },
    ],
    status: "online",
  },
});

// Load commands and start the bot
const startBot = async () => {
  try {
    // Set up event listeners
    const eventsPath = path.join(__dirname, "src/events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = await import(filePath);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }

    client.user?.setActivity("test", { type: ActivityType.Custom });

    // Log in to Discord
    await client.login(process.env.BOT_TOKEN!);
    console.log("Bot logged in successfully.");
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit the process if there's a critical error
  }
};

// Start the bot
startBot();

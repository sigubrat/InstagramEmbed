import {
  Events,
  Message,
  TextChannel,
  NewsChannel,
  ThreadChannel,
} from "discord.js";

export const name = Events.MessageCreate;
export async function execute(message: Message) {
  // Ignore messages from bots to prevent loops
  if (message.author.bot) return;

  // Check if the message contains Instagram reel URLs that start with www.instagram.com/reel
  const instagramReelRegex = /www\.instagram\.com\/reel/gi;
  const embedPrefix = process.env.EMBED_PREFIX || "kk";

  if (instagramReelRegex.test(message.content)) {
    try {
      // Replace www.instagram with www.kkinstagram (case insensitive)
      const modifiedContent =
        `${message.author.displayName} sent: ` +
        message.content.replace(
          /www\.instagram\.com/gi,
          `www.${embedPrefix}instagram.com`
        );

      // Check if the channel supports sending messages
      if (message.channel.isTextBased() && "send" in message.channel) {
        // Send the modified message
        await message.channel.send({
          content: modifiedContent,
          allowedMentions: { parse: [] }, // Prevent mentions in the replaced message
        });

        // Optionally delete the original message (requires manage messages permission)
        try {
          await message.delete();
        } catch (error) {
          console.log(
            "Could not delete original message - missing permissions or message too old"
          );
        }
      }
    } catch (error) {
      console.error("Error processing Instagram URL replacement:", error);
    }
  }
}

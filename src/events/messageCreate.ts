import {
  Events,
  Message,
  TextChannel,
  NewsChannel,
  ThreadChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
      const originalContent = message.content;
      const modifiedContent = message.content.replace(
        /www\.instagram\.com/gi,
        `www.${embedPrefix}instagram.com`
      );

      const initialMessage = `<@${message.author.id}> sent:\n${modifiedContent}`;

      const showOriginalButton = new ButtonBuilder()
        .setCustomId(`show_original_${message.author.id}_${Date.now()}`)
        .setLabel('Show original')
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(showOriginalButton);

      if (message.channel.isTextBased() && "send" in message.channel) {
        const botMessage = await message.channel.send({
          content: initialMessage,
          components: [row],
          allowedMentions: { parse: ['users'] }, 
        });

        // Store the original content and bot message for the button handler
        (botMessage as any).originalContent = originalContent;
        (botMessage as any).modifiedContent = modifiedContent;
        (botMessage as any).authorId = message.author.id;

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

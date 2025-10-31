import { Collection, Events, MessageFlags } from "discord.js";

export const name = Events.InteractionCreate;
export async function execute(interaction: any) {
  // Handle button interactions for "Show original" functionality
  if (interaction.isButton() && interaction.customId.startsWith('show_original_')) {
    try {
      const message = interaction.message;
      const originalContent = (message as any).originalContent;
      const modifiedContent = (message as any).modifiedContent;
      const authorId = (message as any).authorId;

      if (originalContent && modifiedContent && authorId) {
        const updatedMessage = 
          `<@${authorId}> sent:\n` +
          `Original: ${originalContent}\n` +
          `Embed: ${modifiedContent}`;

        await interaction.update({
          content: updatedMessage,
          components: [], // Remove the button after showing original
          allowedMentions: { parse: ['users'] }
        });
      } else {
        await interaction.reply({
          content: "Sorry, I couldn't retrieve the original message data.",
          flags: MessageFlags.Ephemeral
        });
      }
    } catch (error) {
      console.error("Error handling show original button:", error);
      await interaction.reply({
        content: "There was an error showing the original message.",
        flags: MessageFlags.Ephemeral
      });
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  const { cooldowns } = interaction.client;
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1_000);
      return interaction.reply({
        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error, "Failed to create interaction command");
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

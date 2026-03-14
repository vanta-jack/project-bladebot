import {
  InteractionResponseType,
  InteractionResponseFlags,
} from 'discord-interactions';

export const INVITE_COMMAND = {
  name: 'invite',
  description: 'Get an invite link to add the bot to your server',
};

export function handleInviteCommand(applicationId: string) {
  const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: INVITE_URL,
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

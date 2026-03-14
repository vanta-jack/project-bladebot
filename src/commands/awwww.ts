import { InteractionResponseType } from 'discord-interactions';
import { getCuteUrl } from '../reddit.ts';

export const AWW_COMMAND = {
  name: 'awwww',
  description: 'Drop some cuteness on this channel.',
};

export async function handleAwwCommand() {
  const cuteUrl = await getCuteUrl();
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: cuteUrl,
    },
  };
}

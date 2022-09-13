export type CreateChannelDTO = {
  guildId: string
  channelName: string
  creatorId: string
  categoryName?: string | null
}

export enum ChannelVisibility {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

import { Catch, DiscordArgumentMetadata, DiscordExceptionFilter } from '@discord-nestjs/core'
import { APIEmbedField, EmbedBuilder } from 'discord.js'

@Catch(Error)
export class CommandErrorFilter implements DiscordExceptionFilter {
  async catch(
    exception: Error | Error[],
    metadata: DiscordArgumentMetadata<'interactionCreate'>
  ): Promise<void> {
    const [interaction] = metadata.eventArgs

    let error = ''
    if (Array.isArray(exception)) {
      error = exception.map((e) => e.message).join('\n')
    } else {
      error = exception.message
    }

    const fields: APIEmbedField[] = [{ name: 'Message', value: error, inline: false }]

    const exampleEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Somthing went wrong')
      .addFields(...fields)
      .setTimestamp()

    if (interaction.isCommand())
      await interaction.reply({
        embeds: [exampleEmbed],
      })
  }
}

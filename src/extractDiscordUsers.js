import { Client, GatewayIntentBits } from 'discord.js'

const extractDiscordUsers = async () => {
  const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
      ],
    })
  const login = await client.login(process.env.DISCORD_TOKEN)
  console.log('Logged in: ', login)

  try {
    client.on('ready', async () => {
      const guild = await client.guilds.fetch(process.env.GUILD_ID)
      const members = await guild.members.fetch({ limit: 9999 } )
      console.log('Guild members...:')
      for (const member of members) {
        console.log(`id: ${ member[1].user.id } username: ${ member[1].user.username } discriminator: ${ member[1].user.discriminator }`)
      }
    })
  }
  catch(err) {
    console.log('='.repeat(30))
    console.log('Error retrieving Guild Members:')
    console.log(err)
    await client.destroy() // Terminate this Discord bot
  }

}

export default extractDiscordUsers
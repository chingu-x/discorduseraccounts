import { Client, GatewayIntentBits } from 'discord.js'
import { addDiscordIDToApplication } from './utils/updateApplication.js'

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
      const members = await guild.members.fetch({ limit: 5 } )
      console.log('Guild members...:')
      for (const member of members) {
        const userName = member[1].user.username.concat('#', member[1].user.discriminator)
        console.log(`id: ${ member[1].user.id } userName: ${ userName }`)
        const updateResult = await addDiscordIDToApplication(userName, member[1].user.id )
        console.log(`id: ${ member[1].user.id } userName: ${ userName } updateResult: ${ updateResult }`)
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
import { Client, GatewayIntentBits } from 'discord.js'
import { addDiscordIDToApplication } from './utils/updateApplication.js'

const MS_PER_DAY = 86400000

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
      //const members = await guild.members.fetch({ query: 'Hypno', limit: 5 } )
      const members = await guild.members.fetch({ } )
      console.log('Guild members...:')
      let memberCount = 0
      for (const member of members) {

        memberCount = ++memberCount
        const userName = member[1].user.username.concat('#', member[1].user.discriminator)
        console.log(`${ memberCount.toString().padStart(5,"0") } id: ${ member[1].user.id } userName: ${ userName }`)


        // Skip any users whose Discord names contain double quotes, which can't
        // be encoded in an Airtable filter
        let updateResult
        const daysSinceJoined = Number.parseInt((Date.now() - member[1].joinedTimestamp) / MS_PER_DAY)
        
        if (userName.indexOf('"') !== -1 || daysSinceJoined > process.env.DAYS_TO_SEARCH) {
          updateResult = "Skipping"
        } else {
          updateResult = await addDiscordIDToApplication(userName, member[1].user.id )
        }
        console.log(`${ memberCount.toString().padStart(5,"0") } id: ${ member[1].user.id } userName: ${ userName } updateResult: ${ updateResult }`)
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
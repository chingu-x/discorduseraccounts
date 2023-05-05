import { Client, GatewayIntentBits } from 'discord.js'


const extractDiscordUsers = async () => {
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
    ],
  })
  const list = client.guilds.cache.get(process.env.GUILD_ID)
  console.log('list: ', list)
  list.members.cache.forEach(member => console.log(member.user.username));
  client.login(process.env.DISCORD_TOKEN)
}

export default extractDiscordUsers
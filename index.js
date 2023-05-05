import { Command } from 'commander'
import { initDotEnv } from './src/utils/helpers.js'
import dotenv from 'dotenv'
import extractDiscordUsers from './src/extractDiscordUsers.js'

const program = new Command()

//initDotEnv('./')
dotenv.config()

// Process a request to extract user accounts from the Chingu Discord server
program 
  .command('extract <source>')
  .description('Extract user accounts from Discord server')
  .action(async (source, options, command) => {
 
    try {
      if (command._name === 'extract' && source.toLowerCase() === 'users') {
        await extractDiscordUsers()
      }
      process.exit(0)
    }
    catch (err) {
      console.log(err)
      process.exit(0)
    }
  })

  program.parse(process.argv)

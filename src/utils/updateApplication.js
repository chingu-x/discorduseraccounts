import Airtable from 'airtable'

// Retrieve an Application row that matches the specified Discord name. This
// can be either a user name and discriminator (e.g. jdmedlock#4582) or it
// could be the new unique Discord user name (e.g. @jdmedlock)
const getApplication = async (discordName) => {
  return new Promise(async (resolve, reject) => {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE)
    const filter = '{Discord Name} = \"' + discordName + "\" "

    base('Applications').select({ 
      filterByFormula: filter,
      view: 'Applications' 
    })
    .firstPage((err, records) => {
      if (err) { 
        console.error('getApplication - filter: ', filter)
        console.error(err) 
        reject(err) 
      }

      // If the record is found return its id. Otherwise, return null if it's
      // not found
      for (let i = 0; i < records.length; ++i) {
        if (records.length > 0) {
          resolve(records[i].id)
        }
      }
      resolve(null)
    })
  })
}

// Update an exising Application row in Airtable with the users unique Discord ID
const updateApplication = async (recordID, discordID) => {
  return new Promise(async (resolve, reject) => {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE)

    base('Applications').update([
      {
        "id": recordID,
        "fields": {
          "Discord ID": discordID,
        }
      }
    ], (err, records) => {
      if (err) {
        console.error('Error:', err)
        reject(err)
      }

      if (records) {
        resolve(records[0].id)
      } else {
        resolve(null)
      }
    })
  })
}

// Add a users unique Discord ID to their Chingu Application
const addDiscordIDToApplication = async (discordName, discordID) => {
  return new Promise(async (resolve, reject) => {
    let recordID = await getApplication(discordName)

    // If no matching row is found in the table add a new row
    if (recordID === null) {
      resolve(-1)
    } else {
      // If a matching row is found update it with the message count
      const updateResult = await updateApplication(recordID, discordID)
      resolve(updateResult)
    }
  })
}

export { getApplication, updateApplication, addDiscordIDToApplication }
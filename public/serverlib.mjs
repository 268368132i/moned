import { MongoClient, Db, ObjectId } from 'mongodb'

export async function connect(uri) {
  const client = new MongoClient(uri)
  client.on('open', (mcl) => {
    console.log('OPEN successeful: ')
  })
  try {
    // Connect the client to the server
    await client.connect()
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 })
    console.log("Connected successfully to server")
    client.uri = uri
    return client
  } catch (err) {
    console.log(String(err))
    await client.close()
    throw err
  }
}

export async function listDatabases(client) {
  return await client.db("admin").command({ listDatabases: 1 })
}

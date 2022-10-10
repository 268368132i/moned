const express     = require('express')
const MongoClient = require('mongodb').MongoClient
const Db          = require('mongodb').Db
const ObjectId    = require('mongodb').ObjectId
const uuid        = require('uuid')
let app = express()

const connections = new Array()
const actions = {
  find: async (collection, query) => {
    let res
    
      let fnText = ''
      fnText = fnText.concat(
        `\nconsole.log('Second line')`,
        `\nreturn await collection.find(${query}).toArray()`
         )
      console.log('fnTrext=', fnText)
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      fn = new AsyncFunction('collection', 'ObjectId', fnText)
      //res = await collection.find(query).toArray()
      res = await fn(collection, ObjectId)
    return res
  }
}

function listConnections() {
  const connNums = new Array()
  connections.forEach((v, k) => {
    console.log(k)
    connNums.push({
      key: k,
      info: v.options.hosts[0]
    })
  })
  return connNums
}


console.log('server is starting...')

let server = app.listen(3001)

app.use('/connection', express.json())
app.use('/command', express.json())
app.use('/action', express.json())

app.get('/', (req, res) =>{
  res.send('REadY')
})

app.post('/connection', async (req, res) => {
  const connectURL = req.body.dbURL
  const client = new MongoClient(connectURL)
  try {
    // Connect the client to the server
    await client.connect()
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 })
    console.log("Connected successfully to server")
    client.connectUrl = connectURL
    connections.push(client)
    console.log('Options:')
    console.log(client.options)
    console.log('Connections:')
    connections.forEach((v, k) => {
      console.log(k)
    })
  } catch (err) {
    console.log(String(err))
    await client.close()
  }
  res.json(listConnections())

})
app.get('/connection', async (req, res) => {
  res.json(listConnections())
})

app.get('/dbs', async (req, res) => {
  const connNum = parseInt(req.query.connection, 10)
  console.log(`Connection num: ${connNum}`)
  const client = connections[connNum]
  console.log("Client:", client)
  const dbs = await client.db("admin").command({ listDatabases: 1 });
  console.log('Databases:', dbs)
  res.json(dbs)

})

app.get('/collection', async (req, res) => {
  const connNum = parseInt(req.query.connection, 10)
  const db = req.query.db

  const client = connections[connNum]
  try {
  let colls = await client.db(db).collections()
  //colls = colls.toArray()
  console.log('Collections: ', colls)
  const collsNames = colls.map((c) => {
    console.log('C=', c.s.namespace.collection)
    return c.s.namespace.collection
  })
  res.json(collsNames)
  } catch (err) {
    console.log(`Error fetching collections for ${connNum}/${db}:`, String(err))
  }
})

app.get('/action', async (req, res) => {
  const actionsNames = new Array()
  for (const [ name, action ] of Object.entries(actions)) {
    actionsNames.push(name)
  }
  res.json(actionsNames)
})
app.post('/action', async (req, response) => {
  const connection = req.body.connection
  const db = req.body.db
  const collName = req.body.collection
  const actionName = req.body.actionName
  const query = req.body.query
  let res
 // try {
    const client = connections[connection]
    const collection = await client.db(db).collection(collName)
    res = await actions[actionName](collection, query)
    console.log('Action result: ', res)
 /*  } catch (err) {
    res = { error: String(err) }
  } */
  response.json(res)
})

app.post('/command', (req, res) => {
  const c = req.body

})
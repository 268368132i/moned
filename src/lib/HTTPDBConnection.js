import {apiURL} from './vars.js'

export class HTTPDBConnection {
  static async connect(dbURL) {
    this.dbURL = dbURL
    const res = await fetch(apiURL + '/connection',{
      'method': 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(
        {
          dbURL: dbURL
        }
      )
    })
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const json = await res.json()
    console.log('Res json: ' , json)
    return json
  }

  static async getConnectionDBs(connNum) {
    const res = await fetch(apiURL + '/dbs?connection=' + connNum)
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const json = await res.json()
    return json.databases
  }

  static async getCollections(connNum, db) {
    const res  = await fetch(`${apiURL}/collection?connection=${connNum}&db=${db}`)
    console.log('Collections: checking status')
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    return await res.json()
  }

  static async executeAction(path, actionName, query) {
    const action = {
      ...path,
      actionName: actionName,
      query: query
    }
    const result = await fetch(`${apiURL}/action`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(action)
    })
    if (!result.ok) {
      throw new Error(result.statusText)
    }
    return result.json()
  }
} 
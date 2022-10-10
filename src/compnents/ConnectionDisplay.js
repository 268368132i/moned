import React, { useMemo, useState } from 'react'
import { DBConnection } from '../lib/DBConnection'
import DBDisplay from './DBDisplay'




export default function ConnectionDisplay(props) {
  const { conn } = props

  const [ dbs, setDBs ] = useState([])


  console.log('Rendering connection:', conn)
  return (
    <div>
      <button
        onClick={async (e) => {
          if (dbs.length > 0) {
            setDBs([])
            return
          }
          try {
          setDBs(await DBConnection.getConnectionDBs(conn.key))
          } catch (err) {
            console.log(`Error getting databases: ${String(err)}`)
          }
        }}
      >
        {conn.key}: {conn.info.host}:{conn.info.port}
      </button>
      { useMemo(() => (
      <div
        style={{
          'display': 'flex',
          'flexDirection': 'column',
          'margin': '0em 0em 0em 1em'
        }}
      >
        { dbs.map((db) => (
          <DBDisplay
            key = { db.name }
            //Adding connection number for generating requests
            db = {{ ...db,  connection: conn.key }}
            />
        ))}
          </div>
      ), [ dbs ])}
    </div>
  )
}
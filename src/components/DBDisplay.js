import React, { useContext, useState } from 'react'
import { HTTPDBConnection } from '../lib/HTTPDBConnection'
import PathContext from './PathContext'

export default function DBDisplay(props) {
  const { db } = props
  const [colls, setColls] = useState([])

  //Take the second array element since the context contains state and a dispatcher
  const pathDispatcher = useContext(PathContext)[1]

  return (
    <>
      <button
        onClick={async (e) => {
          if (colls.length > 0) {
            setColls([])
            return
          }
          try {
            const ncoll = await HTTPDBConnection.getCollections(db.connection, db.name)
            setColls(await HTTPDBConnection.getCollections(db.connection, db.name))
          } catch (err) {
            console.log('Error getting collections: ', err)
          }
        }}
      >
        {db.name}
      </button>
      <div
        style={{
          'display': 'flex',
          'flexDirection': 'column',
          'flexJustify': 'right',
          'margin': '0em 0em 0em 1em'
        }}
      >
        {
          colls.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                console.log('Dispatching new path')
                pathDispatcher({
                  action: 'SET',
                  element: 'path',
                  value: [
                    db.connection,
                    db.name,
                    c
                  ]
                })
              }}
            >
              {c}
            </button>
          ))
        }
      </div>
    </>
  )
}
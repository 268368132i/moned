import React from 'react'
import { useEffect } from 'react'
import ConnectionDisplay from './ConnectionDisplay'

export default function DBrowser(props) {
  const connList = props.connList
  useEffect(() => {
    console.log('Conns changed:', connList)
  }, [connList])
  return (
    <div
      style={{
        'display': 'flex',
        'flexDirection': 'column',
        'backgroundColor': 'white'
      }}
    >
      {connList.map(element =>  (
            <ConnectionDisplay
              conn = { element }
              key = {element.key }
            />
          )
        )}
    </div>
  )
}
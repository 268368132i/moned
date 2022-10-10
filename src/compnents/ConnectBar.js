import React from 'react'
import { useState } from 'react'

export default function ConnectBar(props) {
  const [url, setURL] = useState('mongodb://localhost/?directConnection=true')
  return (
    <div
      style={{
        'display': 'flex'
      }}
    >
      <input 
        type='text'
        style={{
          'flexGrow': 1
        }}
        onChange={(e) => setURL(e.target.value)}
        value={url}
        />
        <button
          onClick={e => props.handleConnect(url)}
        >
          Connect
          </button>
    </div>
  )
}
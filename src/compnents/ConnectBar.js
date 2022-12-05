import React from 'react'
import { useState } from 'react'
import SavedConnections from './SavedConnections'

export default function ConnectBar(props) {
  const [uri, setURI] = useState('mongodb://localhost/?directConnection=true')
  return (
    <>
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
        onChange={(e) => setURI(e.target.value)}
        value={uri}
        />
        <button
          onClick={e => props.handleConnect(uri)}
        >
          Connect
          </button>
    </div>
    <div>
      <SavedConnections
        uriStateAndSetter = {[uri, setURI]}
      />
    </div>
    </>
  )
}
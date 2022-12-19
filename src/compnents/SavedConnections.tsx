import React, { useEffect, useReducer, useState } from 'react'
import { getReducer } from '../lib/reducer'
import SavedConnection from './SavedConnection'
import type { Action } from '../lib/reducer'
import type { Connection } from '../lib/types'
import { assertIsHTMLElement, assertIsInputElement } from '../lib/assertionsTargets'

// Gets standard reducer + custom functions
const reducer = getReducer({
  SAVE_AND_CLOSE: (state, action) => {
    console.log('Called SAVE_AND_CLOSE reducer', typeof state.connections)
    const newConnections = state.connections?.length > 0 && Array.from(state.connections) || []
    localStorage.setItem('connections', JSON.stringify(newConnections))
    console.log('New connections: ', JSON.stringify(newConnections, null, '  '))
    return {
      ...state,
      connections: newConnections,
      inProcess: false
    }
  },
  UPDATE_AND_SAVE: (state, action) => {
    console.log('Called UPDATE_AND_SAVE reducer', typeof state.connections)
    //Check if we got an array and create an empty one if we didn't
    const newConnections = state.connections?.length > 0 && Array.from(state.connections) || []
    if (typeof action.index === 'number') {
      console.log(`Setting index at ${action.index} to `, action.value)
      newConnections[action.index] = action.value
    }
    localStorage.setItem('connections', JSON.stringify(newConnections))
    console.log('New connections: ', JSON.stringify(newConnections, null, '  '))
    return {
      ...state,
      connections: newConnections,
      inProcess: false
    }
  },
  DELETE_AND_SAVE: (state, action) => {
    console.log(`Called delete_and_save for index ${action.index}`)
    const newConnections =Array.from(state.connections)
    console.log('copied connections: ', newConnections)
    newConnections.splice(action.index, 1)
    console.log('New connections: ', newConnections)
    //Saving connections
    localStorage.setItem('connections', JSON.stringify(newConnections))
    return {...state, connections: newConnections}
  },
  UPDATE_CONNECTION: (state, action) => {
    if (typeof action.index !== 'number') {
      action.index = parseInt(action.index, 10)
    }
    //It is possible to update whole connection when 'element' isn't specified
    if(!action.element) {
      console.log('Updating whole connection')
      state.connections[action.index] = action.value
      return {...state}
    }
    //Updating a single element in a connection
    const conn = state.connections[action.index]
    console.log('Got connection:', conn)
    console.log(`Updating element ${action.element} to `, action.value)
    conn[action.element] = action.value
    console.log('Returning state: ', state)
    return {...state}
  },
  OPEN_FOR_EDITING: (state, action) => {
    const edits = new Array()
    edits[action.index] = true
    return {...state, edits: edits}
  }
})

type Props = {
  uriStateAndSetter: [string, (arg: string)=>void]
}

type SavedConnectionsState = {
  connections: Connection[]
}


export default function SavedConnections(props: Props) {
  //const [connections, setConnections] = useState([])
  const [saveState, dispatcher] = useReducer(reducer, {})
  const [uri, setURIState] = props.uriStateAndSetter

  // Loading saved connections
  useEffect(() => {
    const ac = new AbortController()
    let connections
    if (localStorage.connections) {
      const storedString = localStorage.connections
      console.log('Stored connections: ', storedString)
      connections = JSON.parse(storedString)
      dispatcher({
        action: 'SET',
        element: 'connections',
        value: connections
      })
    } else {
      connections = []
    }
    return ac.abort()
  }, [])

  function setBeingCreated() {
    dispatcher({
      action: 'SET',
      element: 'inProcess',
      value: true
    })
  }
  function setNotBeingCreated() {
    dispatcher({
      action: 'SET',
      element: 'inProcess',
      value: false
    })
  }
  function saveAndClose() {
    console.log('Saving and closing')
    dispatcher({
      action: 'SAVE_AND_CLOSE',
      value: {
        name: saveState.name,
        uri: uri
      }
    })
  }

  function updateName(e: React.ChangeEvent) {
    assertIsInputElement(e.target)
    dispatcher({
      action: 'SET',
      element: 'name',
      value: e.target.value
    })
  }

  // TODO Candidate for removal
/*   function startEdit(e: Event) {
    console.log('Starting edit')
    assertIsHTMLElement(e.target)
    let indexString = e.target.getAttribute('data-index')
    if (!indexString) {
      console.log('Error: incorrect index ', indexString)
      return
    }    
    const indexInt = parseInt(indexString, 10)
    console.log('index ', indexInt)
    dispatcher({
      action: 'UPDATE_CONNECTION',
      index: indexInt,
      element: 'edit',
      value: true
    })
  } */

  //Debug
  useEffect(() => {
    console.log('URI=', uri)
  }, [uri])

  //Debug
  useEffect(() => {
    console.log('Save state: ', saveState)
  }, [saveState])

  // Cast state connections as Connection[] so that TypeScript doesn't complain
  let connections = saveState.connections as Connection[]

  let counter = 0

  return (
    <span>
      {
        (!saveState.connections/*  || saveState.connections.length == 0 */) &&
        <>There are no saved connections</>
      }
      {
        (saveState.connections && saveState.connections.length > 0) &&
        <>
          {
            (saveState.connections as Connection[]).map((connection, index) => (
              <SavedConnection
                key = {index}
                connection = {connection}
                dispatcher = {dispatcher}
                index = {index}
                setURIState = {setURIState}
              />
            ))
          }
        </>
        }
      {!saveState.inProcess &&
        <button
          onClick={setBeingCreated}
        >
          +
        </button>
      }
      {saveState.inProcess &&
        <div>
          <input
            type='text'
            onChange={updateName}
            value={saveState.name}
          >
          </input>
          <button
            onClick={saveAndClose}
          >
            Save
          </button>
          <button
            onClick={setNotBeingCreated}
          >
            Cancel
          </button>
        </div>
      }
    </span>
  )
}
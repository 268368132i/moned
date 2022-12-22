import React, { useContext, useEffect } from 'react'
import DropDown from './DropDown'
import { assertIsInputElement } from '../lib/assertionsTargets'
import './formStyles.css'
import type { Connection} from '../lib/types'
import SavedConnectionEditForm from './SavedConnectionEditForm'
import { WSDBConnection } from '../lib/WSDBConnection'
import { SocketContext } from './SocketContext'
import { Socket } from 'socket.io-client'

type Props = {
  connection: Connection,
  dispatcher: any,
  index: number | null,
  setURIState: any,
}

function invalidZeroLength(element: HTMLInputElement | HTMLTextAreaElement) {
  let newValue: string = element.value
    if (newValue.length===0){
      element.classList.add('invalid')
    } else {
      element.classList.remove('invalid')
    }
}

/**
 * Component for displaying and controlling saved connections
 * @param {*} props 
 * @returns 
 */
export default function SavedConnection(props: Props) {

  const { connection } = props
  const { dispatcher } = props
  const { index } = props
  const setURIState = props.setURIState || (() => {})
  //const { editState } = props
  // SocketContext contains and array from useState
  let socket = useContext(SocketContext)[0]

  let dbConnection: WSDBConnection

if (connection.edit) console.log('Connection IS in edit mode:', connection)
else console.log('Connection is NOT in edit mode:', connection)


  function setURI() {
    setURIState(connection.uri)
  }

  function saveAndClose(connection: Connection): void {
    console.log('New saveAndClose: connection=', connection, `index ${index}`)
    delete connection.edit
    dispatcher({
      action: 'UPDATE_AND_SAVE',
      index: index,
      value: connection
    })
  }
  function deleteAndSave() {
    console.log(`Deleting '${connection.name}' at index ${index}`)
    dispatcher({
      action: 'DELETE_AND_SAVE',
      index: index
    })
  }
  function startEdit() {
    dispatcher({
      action: 'UPDATE_CONNECTION',
      index: index,
      element: 'edit',
      value: true
    })
  }
  function stopEdit() {
    delete connection.edit
    dispatcher({
      action: 'UPDATE_CONNECTION',
      index: index,
      value: connection
    })
  }
  function connect() {
    if(!(dbConnection instanceof WSDBConnection)){
      console.log('Crearting a new db connection, ', dbConnection)
      dbConnection = new WSDBConnection(
        socket,
        connection.uri,
        connection.name
      )
      dbConnection.setOnConnect(()=>{
        dispatcher({
          action: 'UPDATE_CONNECTION',
          index: index,
          element: 'connected',
          value: true
        })
      })
      dbConnection.setOnDisconnect(()=>{
        dispatcher({
          action: 'UPDATE_CONNECTION',
          index: index,
          element: 'connected',
          value: false

        })
      })
    }
    dbConnection.connect()
    console.log('DbConnection=', dbConnection)
  }
  function disconnect(){
    if(dbConnection instanceof WSDBConnection) {
      dbConnection.disconnect()
    }
  }
    return connection.edit 
    ? (<SavedConnectionEditForm
      connection={connection}
      index={index}
      saveAction={saveAndClose}
      cancelAction={stopEdit}
    />)
  : (
    <span
      className='saved-connection'
      key={`${connection.name}${index}`}
      style={{
        backgroundColor: connection.color || ''
      }}
    >
      <DropDown
        mainButton={
/*           <button
            onClick={setURI}
            data-uri={connection.uri}
            style={{
              width: '100%',
              display: 'inline-block'
            }}
          > */
          connection.connected ?
            <button
            onClick={disconnect}
            style={{
              width: '100%',
              display: 'inline-block',
              backgroundColor: 'green'
            }}
          >
            {connection.name}
          </button>
            :
            <button
            onClick={ connect }
            style={{
              width: '100%',
              display: 'inline-block',
            }}
          >
            {connection.name}
          </button>
        }
      >
        <div
          className='menu bg-std v-container'
        >
          <button
            data-index={index}
            onClick={startEdit}
          >
            Edit
          </button>
          <button
            onClick={deleteAndSave}
          >
            Delete
          </button>
        </div>
      </DropDown>
    </span>
  )
}
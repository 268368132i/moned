import React, { useEffect } from 'react'
import DropDown from './DropDown'

export default function SavedConnection(props) {

  const { connection } = props
  const { dispatcher } = props
  const { index } = props
  const setURIState = props.setURIState || (() => {})
  const { editState } = props


  //Debug 
  useEffect(()=>{
    console.log('Editing: ', editState)
  }, [editState])
  function setURI(event) {
    setURIState(connection.uri)
  }

  //Updating 'name' element into 'newName' so that we can undo the renaming on 'Cancel'
  function updateName(event) {
    dispatcher({
      action: 'UPDATE_CONNECTION',
      index: index,
      element: 'edit',
      value:  {
        ...connection.edit,
        newName: event.target.value
      }
    })
  }

  //Updating 'uri' element into 'newUri' so that we can undo the change on 'Cancel'
  function updateUri(event) {
    dispatcher({
      action: 'UPDATE_CONNECTION',
      index: index,
      element: 'edit',
      value: {
        ...connection.edit,
        newUri: event.target.value
      }
    })
  }

  //Update background color
  function updateColor(event) {
    dispatcher({
      action: 'UPDATE_CONNECTION',
      index: index,
      element: 'edit',
      value: {
        ...connection.edit,
        newColor: event.target.value
      }
    })
  }

  //Save new values
  function saveAndClose() {
    console.log('Saving and closing')
    const newConn = {
      name: connection.edit.newName,
      uri: connection.edit.newUri,
      color: connection.edit.newColor
    }
    console.log('New connection:', newConn)
    dispatcher({
      action: 'UPDATE_AND_SAVE',
      index: index,
      value: newConn
    })
  }
  function deleteAndSave(event) {
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
      value: {
        newName: connection.name,
        newUri: connection.uri,
        newColor: connection.color
      }
    })
  }
  function stopEdit(event) {
    delete connection.edit
    dispatcher({
      action: 'UPDATE_CONNECTION',
      index: index,
      value: connection
    })
  }

  return connection.edit
  ? (
    <div
      className='box'
      style={{backgroundColor: connection.edit.newColor || connection.color || ''}}
    >
      <div
        className='box-title'
      >
        Edit {connection.name}
      </div>
      <div
        className='box-items'
      >
        <label
          for='nameEdit'
          className='box-item-label'
          >
            Name: 
          </label>
      <input
        className='box-item-input'
        name='nameEdit'
        type='text'
        onChange={updateName}
        value={connection.edit.newName}
      >
      </input>
      </div>
      <div
        className='box-items'
      >
        <label
          for='uriEdit'
          className='box-item-label'
          >
            URI: 
          </label>
        <textarea
          className='box-item-input'
          name='uriEdit'
            onChange={updateUri}
            value={connection.edit.newUri}
          >
          </textarea>
        </div>
        <div
          className='box-items'
        >
          <label
          className='box-item-label'
            for='colorPicker'
          >
            Color:
          </label>
          <input
            className='box-item-input'
            type='color'
            onChange={updateColor}
            value={connection.edit.newColor || connection.color || ''}
          >

          </input>
        </div>
        <button
          className='box-action'
          onClick={saveAndClose}
        >
          Save
        </button>
        <button
          className='box-action'
          onClick={stopEdit}
        >
        Cancel
      </button>
    </div>
  ) 
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
          <button
            onClick={setURI}
            uri={connection.uri}
            style={{
              width: '100%',
              display: 'inline-block'
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
            index={index}
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
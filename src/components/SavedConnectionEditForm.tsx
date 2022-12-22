import React, { useState } from 'react'
import { assertIsHTMLElement, assertIsInputElement } from '../lib/assertionsTargets'
import type { Connection } from '../lib/types'
import './formStyles.css'

type Props = {
  connection: Connection,
  saveAction: (conn: Connection) => void,
  cancelAction: () => void,
  index: number | null
}

function invalidZeroLength(element: HTMLInputElement | HTMLTextAreaElement) {
  let newValue: string = element.value
    if (newValue.length===0){
      element.classList.add('invalid')
    } else {
      element.classList.remove('invalid')
    }
}

export default function SavedConnectionForm(props: Props) {
  const { connection, saveAction, cancelAction } = props

  const [state, setState] = useState<Connection>({...connection})

   function updateName(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    assertIsInputElement(event.target)
    invalidZeroLength(event.target)
    setState({...connection, name: event.target.value})
  }

  function updateUri(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    assertIsInputElement(event.target)
    invalidZeroLength(event.target)
    setState({...connection, uri: event.target.value})
  }

  //Update background color
  function updateColor(event: React.ChangeEvent) {
    assertIsInputElement(event.target)
    setState({...connection, color: event.target.value})
  }

  // Using a separate function to pass form data (Conection)
  function saveAndClose() {
    saveAction(state)
  }


  if (!connection.edit) {
    return (<div>This connection doesn't exist</div>)
  }
  return (
    <div
      className='box'
      style={{backgroundColor: state.color || connection.color || ''}}
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
          htmlFor='nameEdit'
          className='box-item-label'
          >
            Name: 
          </label>
      <input
        className='box-item-input'
        name='nameEdit'
        type='text'
        onChange={updateName}
        value={state.name}
      >
      </input>
      </div>
      <div
        className='box-items'
      >
        <label
          htmlFor='uriEdit'
          className='box-item-label'
          >
            URI: 
          </label>
        <textarea
          className='box-item-input'
          name='uriEdit'
            onChange={updateUri}
            value={state.uri}
          >
          </textarea>
        </div>
        <div
          className='box-items'
        >
          <label
            className='box-item-label'
            htmlFor='colorPicker'
          >
            Color:
          </label>
          <input
            className='box-item-input'
            type='color'
            onChange={updateColor}
            value={state.color|| ''}
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
          onClick={cancelAction}
        >
        Cancel
      </button>
    </div>
  ) 
}
import React from 'react'

export default function ModalDialog(props) {

  const [state, setState] = props.state ? props.state : []
  return (
    <>
    {
      state?.enabled &&
      <div
      className='modal'
    >
      <div
        className='modal-content'
        >
          <div
            className='close'
            >
              X
            </div>
          <p>Test</p>
        </div>
    </div>
    
    }
    </>
  )
}
import React, { useEffect, useRef, useState } from 'react'
import { useGlobalClick } from './useGlobalClick'

export default function DropDown(props) {
  const { mainButton } = props
  const { children } = props

  const [open, setOpen] = useState(false)

  const refIgnore = useRef()

  const handleOpen = (e) => {
    setOpen(true)
  }
  const toggleOpen = (e) => {
    open ? setOpen(false) : setOpen(true)
  }

  const handleGlobalClickFn = useRef((event) => {
    if (refIgnore && refIgnore.current && refIgnore.current.contains(event.target)) {
      console.log('Clicked on menu. Doing nothing.', refIgnore.current)
      return
    }
    console.log('Clicked outside.Closing.', refIgnore.current)
    setOpen(false)
  })

  useEffect(()=>{
    if (open) {
      console.log('Adding global event listener')
      document.addEventListener('click', handleGlobalClickFn.current)
    } else {
      console.log('Remlving event listener')
      document.removeEventListener('click', handleGlobalClickFn.current)
    }
  }, [open])

  return (

    <div
      ref = {refIgnore}
      style = {{
        display: 'inline-block'
      }}
    >
      <span
        style = {{
          display: 'inline-block'
        }}
      >
        {mainButton}
      </span>
        {open &&
          <div
          className='menu'
          >
            <div
              style = {{
                marginLeft: '-0px'
              }}
            >
            { children }
            </div>
          </div>
        }
      <button
        onClick = { toggleOpen }
        style = {{
          display: 'inline-block'
        }}
        >
        E
      </button>
      </div>
  )
}
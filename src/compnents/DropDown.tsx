import React, { MouseEventHandler, ReactComponentElement, useEffect, useRef, useState } from 'react'

function assertIsNode(event: EventTarget | null): asserts event is Node {
  if (!event || !('nodeType' in event)) {
    throw new Error('Not a node')
  }
}
/**
 * @param mainButton An element which the menu will be attached to
 * @param children Menu contents
 */
type Props = {
  mainButton: JSX.Element,
  children: JSX.Element
}

/**
 * A minimal element to create a drop-down element
 * @param {Props} props
 * @returns React Functional Component
 */
export default function DropDown(props: Props): JSX.Element {
  const { mainButton } = props
  const { children } = props

  const [open, setOpen] = useState(false)

  //Reference to component itself (DOM element)
  const refSelf = useRef<HTMLDivElement>(null)

  const toggleOpen = (e: React.MouseEvent) => {
    open ? setOpen(false) : setOpen(true)
  }

  const handleGlobalClickFn = useRef((event: Event) => {
    assertIsNode(event.target)
    if (refSelf && refSelf.current && refSelf.current.contains(event.target)) {
      console.log('Clicked on menu. Doing nothing.', refSelf.current)
      return
    }
    console.log('Clicked outside.Closing.', refSelf.current)
    setOpen(false)
  })

  // We need to register a global event so that the menu
  // can be closed by clicking outside
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
      ref = {refSelf}
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
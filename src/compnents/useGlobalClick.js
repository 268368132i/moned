import React, { useEffect } from 'react'

export function useGlobalClick(callback, refIgnore) {
  useEffect( () => {
    function handleClick(event) {
      console.log('refIgnore=', refIgnore.current, 'target=', event.target)
      if (refIgnore && refIgnore.current && refIgnore.current.contains(event.target)) {
        return
      }
      callback()
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])
}
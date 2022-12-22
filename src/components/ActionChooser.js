import React, { useEffect, useReducer } from 'react'
import { getReducer } from '../lib/reducer'
import { apiURL } from '../lib/vars'

const reducer = getReducer()

export default function ActionChooser() {

  const [actionsState, actionsDispatcher] = useReducer(reducer, {})


  //Load available actionsState
  useEffect(() => {
    async function getActions() {
      actionsDispatcher({
        action: 'START'
      })
      try {
        const res = await fetch(`${apiURL}/action`)
        if (!res.ok) {
          console.log(`Fetch: somethinf isn't ok: ${res.statusText}`)
          throw new Error((await res).statusText)
        }
        actionsDispatcher({
          action: 'FINISH',
          element: 'actions',
          value: await res.json()
        })
      } catch (err) {
        console.log(`Error fetching available actionsState: ${String(err)}`)
        actionsDispatcher({
          action: 'ERROR',
          value: String(err)
        })
      }
    }
    getActions()
  }, [])

  useEffect(()=>{
    console.log('Actions state: ', actionsState)
  }, [actionsState])

  return (
    <>
    <span>Actions: </span>
    {
      actionsState.pending &&
      <span>Loading...</span>
    }
    {
      actionsState.error &&
      <span>{actionsState.error}</span>
    }
    {
      (actionsState.actions?.length) &&
      <select>
        {
          actionsState.actions.map(a => (
            <option value={a} key={a}>{a}</option>
          ))
        }
      </select>
    }
    </>
  )
}
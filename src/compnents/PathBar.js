import React, { useContext, useEffect } from 'react'
import PathContext from './PathContext'

export default function PathBar(props) {
  const {ret} = props
  //const { path } = props
  //Getting path state from context
  const pathState = useContext(PathContext)[0]
  useEffect(() =>{
    if (!pathState.path?.length) {
      return
    }
    console.log('Path changed. State:', pathState)
    const retInfo = {
      connection: pathState.path[0],
      db: pathState.path[1],
      collection: pathState.path[2]
    }
    console.log('Ret info: ', retInfo)
    ret({
      connection: pathState.path[0],
      db: pathState.path[1],
      collection: pathState.path[2]
    })
  }, [ pathState.path ])

  return (
    <div
      style = {{
        'display': 'flex',
        'flexDirection': 'row',
        'flexJustify': 'start',
        'backgroundColor': '#808080'
      }}
    >
      Path:
      {
        pathState.path?.map((p) => (
          <span>
            /{ p }
          </span>
        ))
      }
    </div>
  )
}
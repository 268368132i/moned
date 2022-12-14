import logo from './logo.svg'
// import './App.css'
import CodeEditor from './components/CodeEditor'
import ConnectBar from './components/ConnectBar'
import { HTTPDBConnection } from './lib/HTTPDBConnection'
import { useEffect, useReducer, useState } from 'react'
import DBrowser from './components/DBrowser'
import PathContextimport, { PathProvider, reducer } from './components/PathContext'
import PathBar from './components/PathBar'
import ActionChooser from './components/ActionChooser'
import { getReducer } from './lib/reducer'
import CodeDisplay from './components/CodeDisplay'
import ModalDialog from './components/ModalDialog'
import { io } from 'socket.io-client'
import React, { createContext } from 'react'
import { SocketContext } from './components/SocketContext'
const resultReducer = getReducer()

let socket
function App() {

  const [conns, setConns] = useState([])
  const code = useState('')
  const result = useReducer(resultReducer, { result: '' })



  /*   useEffect(() => {
      console.log('Result has changed: ', result)
    }, [result[0]])
    useEffect(() => {
      socket = io("ws://localhost:3000")
  
    }, [])
    function testWS(e) {
      console.log('WS connection: ', socket)
      // send a message to the server
      socket.emit('test message', {message: 'test'})
    } */



  return (
    <>
      <div
        className="App"
        style={{
          'display': 'flex',
          'flexDirection': 'column',
          'backgroundColor': 'darkBlue',
          'color': 'beige',
          'height': '100%'
        }}
      >
        <ModalDialog
          style={{}}
        />
        <PathProvider
          value={useReducer(reducer, { path: [] })}
        >
          <SocketContext.Provider value={useState(io('ws://localhost:3000'))}>
            <ConnectBar
              handleConnect={async (url) => {
                setConns(await HTTPDBConnection.connect(url))
              }
              }
            />
          </SocketContext.Provider>
          <PathBar
            ret={v => {
              console.log('Got value: ', v)
              result[1]({
                action: 'SET',
                element: 'path',
                value: v
              })
            }}
          />
          <ActionChooser />
          <div
            style={{
              'display': 'flex',
              'flexDirection': 'column',
              'alignItems': 'stretch',
              'flexGrow': '1'
            }}
          >
            <div
              style={{
                'backgroundColor': 'white',
                'display': 'flex',
                'flexDirection': 'row',
                'flexGrow': '1',
                'alignItems': 'stretch'
              }}
            >
              <DBrowser
                connList={conns}
              />
              <div
                style={{
                  'flexGrow': '1',
                  'overflowY': 'scroll'
                }}
              >
                <CodeEditor
                  code={code}
                // onChange = {(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={async e => {
                result[1]({ action: 'START' })
                try {
                  const res = await HTTPDBConnection.executeAction(result[0].path, 'find', code[0])
                  result[1]({
                    action: 'FINISH',
                    element: 'result',
                    value: res
                  })
                } catch (err) {
                  console.log(`Error sending command: ${String(err)}`)
                  result[1]({
                    action: 'ERROR',
                    value: String(err)
                  })
                }
              }}
            >
              Execute
            </button>
            <CodeDisplay
              code={[result[0].result, v => {
                result[1]({
                  action: 'SET',
                  element: 'result',
                  value: v
                })
              }]}
            />
          </div>
        </PathProvider>
      </div>
    </>
  );
}

export default App;

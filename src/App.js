import logo from './logo.svg'
// import './App.css'
import CodeEditor from './compnents/CodeEditor'
import ConnectBar from './compnents/ConnectBar'
import { DBConnection } from './lib/DBConnection'
import { useEffect, useReducer, useState } from 'react'
import DBrowser from './compnents/DBrowser'
import PathContextimport, { PathProvider, reducer } from './compnents/PathContext'
import PathBar from './compnents/PathBar'
import ActionChooser from './compnents/ActionChooser'
import { getReducer } from './lib/reducer'
import CodeDisplay from './compnents/CodeDisplay'
import ModalDialog from './compnents/ModalDialog'
import { io } from 'socket.io-client'

const resultReducer = getReducer()

let socket
function App() {

  const [conns, setConns] = useState([])
  const code = useState('')
  const result = useReducer(resultReducer, {result: ''})

  useEffect(() => {
    console.log('Result has changed: ', result)
  }, [result[0]])
  useEffect(() => {
    socket = io("ws://localhost:3000")

  }, [])
  function testWS(e) {
    console.log('WS connection: ', socket)
    // send a message to the server
    socket.emit('test message', {message: 'test'})
  }

  return (
    <>
    <button
    onClick={testWS}
    >
      Test WS
    </button>
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
        <ConnectBar
          handleConnect={async (url) => {
            setConns(await DBConnection.connect(url))
          }
          }
        />
        <PathBar
          ret = { v=> {
            console.log('Got value: ', v)
            result[1]({
              action: 'SET',
              element: 'path',
              value: v
            })
          }}
        />
        <ActionChooser/>
        <div
          style = {{
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
            style = {{
              'flexGrow': '1',
              'overflowY': 'scroll'
            }}
          >
          <CodeEditor
            code = {code}
            // onChange = {(e) => setCode(e.target.value)}
          />
          </div>
        </div>
        <button
          onClick = { async e => {
            result[1]({action: 'START'})
            try {
              const res = await DBConnection.executeAction(result[0].path, 'find', code[0])
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
          code = { [ result[0].result, v => {
            result[1]({
              action: 'SET',
              element: 'result',
              value: v
            })
          }] }
        />
        </div>
      </PathProvider>
    </div>
    </>
  );
}

export default App;

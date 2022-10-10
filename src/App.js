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

const resultReducer = getReducer()

function App() {

  const [conns, setConns] = useState([])
  const code = useState('')
  const result = useReducer(resultReducer, {result: ''})

  useEffect(()=>{
    console.log('Result has changed: ', result)
  }, [result[0]])

  return (
    <div
      className="App"
      style={{
        'display': 'flex',
        'flexDirection': 'column',
        'backgroundColor': 'darkBlue',
        'height': '100%'
      }}
    >
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
                value: JSON.stringify(res)
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
        <CodeEditor
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
  );
}

export default App;

import CodeEditor from './components/CodeEditor'
import ConnectBar from './components/ConnectBar'
import { HTTPDBConnection } from './lib/HTTPDBConnection'
import { useReducer, useState } from 'react'
import DBrowser from './components/DBrowser'
import { PathProvider, reducer } from './components/PathContext'
import PathBar from './components/PathBar'
import ActionChooser from './components/ActionChooser'
import { getReducer } from './lib/reducer'
import CodeDisplay from './components/CodeDisplay'
import ModalDialog from './components/ModalDialog'
import React from 'react'
import { SocketContext } from './components/SocketContext'
import CommunicationStore from './CommunicationStore'
const resultReducer = getReducer()

console.log('App start')
if (document.communicationStore) {
  // triggered on hotmodule reload
  document.communicationStore.destroy();
  delete document.communicationStore;
}
const communicationStore = new CommunicationStore();
// for debug from browser console
document.communicationStore = communicationStore;

function App() {
  const [conns, setConns] = useState([])
  const code = useState('')
  const result = useReducer(resultReducer, { result: '' })

  return (
    <>
      <span>APP span</span>
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
          style={{ }}
        />
        <PathProvider
          value={useReducer(reducer, { path: [] })}
        >
          <SocketContext.Provider value={communicationStore}>
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

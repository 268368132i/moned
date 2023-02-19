// import CodeEditor from './components/CodeEditor'
// import ConnectBar from './components/ConnectBar'
// import { HTTPDBConnection } from './lib/HTTPDBConnection'
// import { useReducer, useState } from 'react'
// import DBrowser from './components/DBrowser'
// import { PathProvider, reducer } from './components/PathContext'
// import PathBar from './components/PathBar'
// import ActionChooser from './components/ActionChooser'
// import { getReducer } from './lib/reducer'
// import CodeDisplay from './components/CodeDisplay'
// import ModalDialog from './components/ModalDialog'
import React, { useReducer } from 'react'
import { SocketContext } from './components/SocketContext'
import CommunicationStore from './CommunicationStore'
import { Box, ChakraProvider, Flex, TabList, Tabs, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid';
import { TabMain } from './tab/main'
import type { AppState } from './types/app';
import { AddIcon } from '@chakra-ui/icons';
import { TabNewQuery } from './tab/newQuery';

// const resultReducer = getReducer()

const browserDoc = document as typeof document & { communicationStore?: CommunicationStore }
console.log('App start')
if (browserDoc.communicationStore) {
  // triggered on hotmodule reload
  browserDoc.communicationStore.destroy();
  delete browserDoc.communicationStore;
}
const communicationStore = new CommunicationStore();
// for debug from browser console
browserDoc.communicationStore = communicationStore;


function appReducer(state: AppState, action: any) {
  return state;
}

function App() {
  const [appState, dispatch] = useReducer(appReducer, {
    tabs: [{
      id: uuidv4(),
      name: 'Query',
    },{
      id: uuidv4(),
      name: 'New',
      createNew: true
    }]
  })


  return (
    <ChakraProvider>
      <Tabs className='fullHeight flexVertical'>
        <TabList>
          {appState.tabs.map((tab) => (
          <Tab key={tab.id}>
            {tab.createNew && <AddIcon/>}
            {!tab.createNew && tab.name}
          </Tab>))}
        </TabList>

        <TabPanels className="flexVertical flexGrow">
          {appState.tabs.map((tab) => (
          <TabPanel className="flexVertical flexGrow" key={tab.id}>
            <TabMain appTab={tab}/>
          </TabPanel>))}
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;

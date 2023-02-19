import { Box, Flex } from '@chakra-ui/react'
import React, { useReducer } from 'react'
import type { AppTabProps } from '../types/app'
import Editor from 'react-simple-code-editor';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

function sendFocuseToCode (event: MouseEvent) {
    console.log('alala', this)
    if (event.target instanceof HTMLElement) {
        const areaElement = event.target?.getElementsByClassName('editor')?.[0]?.getElementsByTagName('textArea')?.[0];
        if (areaElement instanceof HTMLElement) {
            areaElement.focus()
            event.preventDefault()
        }
    }
}

type TabMainProps = {
    appTab: AppTabProps
}
export function TabMain({ appTab }: TabMainProps) {
    const [code, setCode] = React.useState(
        `function add(a, b) {\n  return a + b;\n}`
      );
      

    return (
    <Flex direction='column' alignSelf={'stretch'} flexGrow={1}>
        <Flex flexGrow={1} alignItems='stretch' alignSelf='stretch'>
            <Box>
                Connections and collections
            </Box>
            <Flex
                className='scrolled-body-wrapper'
                direction='column'
                flexGrow={1}
                alignItems='stretch'
            >
                <div className='scrolled-body' onClick={sendFocuseToCode}>
                <Editor
                    className='flexGrow editor'
                    value={code}
                    onValueChange={code => setCode(code)}
                    highlight={code => highlight(code, languages.javascript, 'javascript')}
                    padding={10}
                />
                </div>
            </Flex>
        </Flex>
        <Flex>
            Console
        </Flex>
    </Flex>
    )
}
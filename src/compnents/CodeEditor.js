import React from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'

export default function CodeEditor(props) {
  const [code, setCode] = props.code
  return (
    <Editor
      value={code}
      class='line-numbers'
      onValueChange={code => setCode(code)}
      highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  )
}


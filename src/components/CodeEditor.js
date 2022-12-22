import React, {useEffect, useContext, useRef} from 'react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react'
import PathContext from './PathContext'

/* function ensureFirstBackSlash(str) {
  return str.length > 0 && str.charAt(0) !== "/"
      ? "/" + str
      : str;
}

function uriFromPath(_path) {
  const pathName = path.resolve(_path).replace(/\\/g, "/");
  return encodeURI("file://" + ensureFirstBackSlash(pathName));
}

loader.config({
  paths: {
    vs: uriFromPath(
      path.join(__dirname, "../node_modules/monaco-editor/min/vs")
    )
  }
}); */
export default function CodeEditor(props) {
  const [code, setCode] = props.code
  const [code2, setCode2] = props.code2 || ['', ()=>{}]
  const pathState = useContext(PathContext)[0]

  //const monaco = useMonaco()

  const editorRef = useRef(null)

  function handleEditorDidMount(editor, monaco) {
    //console.log('Editor', editor)
    editorRef.current = editor
  }
  
/*   useEffect(() => {
    // do conditional chaining

    if (!monaco) {
      return
    }
  }, [monaco]); */

  useEffect(() => {
     if(!editorRef.current){
      return
    } 
    console.log('Editor: ', editorRef, '\npathState: ', pathState)
      editorRef.current.executeEdits("", [{
      range: {
        startLineNumber: editorRef.current.getPosition().lineNumber,
        startColumn: editorRef.current.getPosition().column,
        endLineNumber: editorRef.current.getPosition().lineNumber,
        endColumn: editorRef.current.getPosition().column
      },
      text: `connections[${pathState.path[0]}].db('${pathState.path[1]}').collection('${pathState.path[2]}')`
    }]) 
  },[pathState])


/*   useEffect(() => {
    if (!monaco) {
      return
    }
    monaco.value = code2
  }, [code2]) */

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onChange={(v, e) => setCode(v)}
      onMount={handleEditorDidMount}
    />
  )
}


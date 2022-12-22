import React, {useEffect, useMemo} from 'react'
import Prism from 'prismjs'

export default function CodeDisplay(props) {

  useEffect(() => {
    Prism.highlightAll()
  });
  const code = useMemo(() =>{
    const ncode = JSON.stringify(props.code[0], null, '  ')
    console.log('New code: ', ncode)
    return ncode
  }, [props.code[0]])

  return (
    <div>
      <pre>
        <code className={`language-javascript`}>{code}</code>
      </pre>
    </div>
  )
}
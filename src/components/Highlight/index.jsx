import React, {useRef, useEffect} from 'react';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atelier-savanna-light.css';
hljs.registerLanguage('javascript', javascript)

const Highlighter = (props) => {

  const ref = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(ref.current);
  }, []);

  return (
    <pre ref={ref}>
      <code className="javascript">
        {props.children}
      </code>
    </pre>
  )
}

export default Highlighter;

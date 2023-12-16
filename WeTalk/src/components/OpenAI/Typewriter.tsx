import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const useTypewriter = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // let i = 0;
    // const typingInterval = setInterval(() => {
    //   if (i < text.length) {
    //     setDisplayText((prevText) => prevText + text.charAt(i));
    //     i++;
    //   } else {
    //     clearInterval(typingInterval);
    //   }
    // }, speed);

    // return () => {
    //   clearInterval(typingInterval);
    // };
    for (let i = 0; i < (text || '').length; i++) {
      setTimeout(() => {
        setDisplayText(text.slice(0, i + 1));
      }, i * speed);
    }
  }, [text, speed]);

  return displayText;
};

const renderers = {
  code: ({ language, value }) => {
    const codeValue = value || 'No code to display';

    return (
      <SyntaxHighlighter
        style={materialDark}
        language={language || 'plaintext'}
      >
        {codeValue}
      </SyntaxHighlighter>
    );
  },
};

const Typewriter = ({ text, speed }) => {
  const displayText = useTypewriter(text, speed);

  return (
    <>
      <ReactMarkdown remarkPlugins={[gfm]} components={renderers}>
        {displayText}
      </ReactMarkdown>
    </>
  );
};

export default Typewriter;

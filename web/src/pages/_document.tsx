import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeProvider  } from '@chakra-ui/core'

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head />
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeProvider >
          <Main />
          </ColorModeProvider>
          <NextScript />
        </body>
      </Html>
    )
  }
}

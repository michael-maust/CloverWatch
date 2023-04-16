import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.1/mapbox-gl.css" type="text/css" />
      </Head>
      <body >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

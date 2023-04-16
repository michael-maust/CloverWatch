import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '~/components/Layout'
import FieldMapUpdate from '~/components/map/FieldMap'

import "mapbox-gl/dist/mapbox-gl.css";
import FieldMap from '~/components/map/FieldMap';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>CloverWatch</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.1/mapbox-gl.css" type="text/css" />
      </Head>
      <Layout>
        <div className="dark:text-gray-50">Home Page</div>
      </Layout>
      <Layout>
        <FieldMap use='display' fieldID={21} />
        {/* <FieldMap use='create' /> */}
      </Layout>
    </div>
  )
}

export default Home

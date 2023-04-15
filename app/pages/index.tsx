import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '~/components/Layout'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>CloverWatch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="dark:text-gray-50">Home Page</div>
      </Layout>
    </div>
  )
}

export default Home

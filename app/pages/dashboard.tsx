import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '~/components/Layout'

const Dashboard: NextPage = () => {
	return (
		<div className="flex bg-red-200 flex-col items-center justify-center overflow-y-auto">
			<Head>
				<title>Dashboard</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<div className="dark:text-gray-50 flex flex-1 overflow-y-auto w-full bg-blue-500">Dashboard</div>
			</Layout>
		</div>
	)
}

export default Dashboard

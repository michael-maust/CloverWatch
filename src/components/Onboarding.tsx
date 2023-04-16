import { useCallback, useEffect, useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from './TextField';
import Dashboard from './Dashboard';
import Image from 'next/image'
import logo from 'public/logo.svg'
import Router, { useRouter } from "next/router";
import cx from 'clsx'
import Layout from './Layout';

const schema = z.object({
	fullName: z.string().min(1, "Your name is required"),
	farmName: z.string().min(1, "Farm name is required"),
	zipcode: z.string().min(1, "Zipcode is required"),
});


export default function Onboarding() {
	const [isUpdating, setIsUpdating] = useState(false)
	const { loading, fullName, zipcode, farmName, profileId, updateProfile } = useProfile()

	const router = useRouter()



	const methods = useForm({
		defaultValues: {
			fullName: fullName ?? '',
			farmName: farmName ?? '',
			zipcode: zipcode ?? '',
		},
		resolver: zodResolver(schema),
	});

	const { handleSubmit, reset, control, watch } = methods;

	useEffect(() => {
		reset({
			fullName: fullName ?? '',
			farmName: farmName ?? '',
			zipcode: zipcode ?? '',
		})
	}, [farmName, fullName, reset, zipcode])

	const onSubmit = useCallback(
		async (data: any) => {
			if (loading) return;
			await updateProfile(data);
			setIsUpdating(false)
			router.reload()
		},
		[loading, router, updateProfile]
	);

	if (loading) return <Layout>Loading...</Layout>

	if (!zipcode || !farmName || isUpdating) return (
		<div className="w-screen h-screen flex justify-center items-center">


			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-3 overflow-y-auto p-1 w-1/2 h-3/4 bg-tan border-2 shadow-lg border-charcoal rounded-2xl items-center justify-center"
				>

					<Image src={logo} alt='header image' width={300} height={300} className='mb-6' />
					<div className="flex flex-col items-center">
						<h2 className="text-2xl font-bold text-charcoal mb-0 pb-0">Farm Details</h2>
						<p className="mb-6 text-charcoal font-normal">Provide some details about your farm</p>
					</div>

					<TextField
						label="Your Name"
						fieldName="fullName"
						placeholder="Enter your full name"
						className='min-w-[300px]'
					/>

					<TextField
						label="Farm Name"
						fieldName="farmName"
						placeholder="Enter the farm name"
						className='min-w-[300px]'
					/>

					<TextField
						label="Zipcode"
						fieldName="zipcode"
						placeholder="Enter the zipcode"
						className='min-w-[300px]'
					/>

					{/* Hidden submit used as a quick way to enable submit onEnter */}
					<input type="submit" className="hidden" />
					<div className={cx("flex justify-between gap-3  ", isUpdating && 'grid grid-cols-2 max-w-[300px] w-full')}>
						<button
							onClick={handleSubmit(onSubmit)}
							className="py-1 px-2 bg-green text-white rounded-lg min-w-[150px]  mt-3 hover:opacity-70"
						>
							Submit
						</button>
						{isUpdating && <button
							onClick={() => setIsUpdating(false)}
							className="py-1 px-2 bg-charcoal text-white rounded-lg  mt-3 hover:opacity-70"
						>
							Cancel
						</button>}
					</div>
				</form>
			</FormProvider>
		</div>
	)

	return (<Dashboard setIsUpdating={setIsUpdating} />)

}

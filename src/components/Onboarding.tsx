import { useState, useEffect, useCallback } from 'react'
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { useProfile } from '@/hooks/useProfile'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from './TextField';

const schema = z.object({
	fullName: z.string().min(1, "Your name is required"),
	farmName: z.string().min(1, "Farm name is required"),
	zipcode: z.string().min(1, "Zipcode is required"),
});


export default function Onboarding({ session }: { session: Session }) {
	const { loading, fullName, zipcode, farmName, updateProfile } = useProfile(session)


	const methods = useForm({
		defaultValues: {
			fullName: fullName ?? '',
			farmName: farmName ?? '',
			zipcode: zipcode ?? '',
		},
		resolver: zodResolver(schema),
	});

	const { handleSubmit, reset, control, watch } = methods;

	const onSubmit = useCallback(
		(data: any) => {
			if (loading) return;
			updateProfile(data);
		},
		[loading, updateProfile]
	);

	if (!zipcode || !farmName) return (
		<FormProvider {...methods}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3 overflow-y-auto p-1 pr-5"
			>

				<TextField
					label="Your Name"
					fieldName="fullName"
					placeholder="Enter your full name"
				/>

				<TextField
					label="Farm Name"
					fieldName="farmName"
					placeholder="Enter the farm name"
				/>

				<TextField
					label="Zipcode"
					fieldName="zipcode"
					placeholder="Enter the zipcode"
				/>

				{/* Hidden submit used as a quick way to enable submit onEnter */}
				<input type="submit" className="hidden" />
				<button
					onClick={handleSubmit(onSubmit)}
					className="py-1 px-2 bg-green text-white rounded-lg"
				>
					Submit
				</button>



			</form>
		</FormProvider>
	)

	return (
		<div className="">Onboarding {fullName} - {zipcode} - {farmName} </div>
	)
}

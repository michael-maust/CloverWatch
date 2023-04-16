import { useProfile } from '@/hooks/useProfile'
import { Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleDown, faChevronDown, faPencil } from '@fortawesome/free-solid-svg-icons'
import Layout from '@/components/Layout'

type FieldProps = {
	setIsUpdating: Dispatch<SetStateAction<boolean>>
}

function Fields({ setIsUpdating }: FieldProps) {
	const { loading, fullName, zipcode, farmName, profileId, updateProfile } = useProfile()

	return (
		<Layout className='flex-col gap-3 flex-1 grid grid-rows-[fit-content,auto] relative'>

			<div className="bg-lightGreen w-full flex-1 sticky top-0 p-6 items-center flex">
				<div className="flex gap-3 justify-between w-full items-center">
					<div className="flex gap-3 items-center">
						<h2 className="text-3xl font-bold text-charcoal">Field Overview
							<span className='text-orange mx-3'>{`//`}</span>
						</h2>
						<div className="px-6 py-1 border border-charcoal rounded-lg">
							Field Name
						<FontAwesomeIcon icon={faChevronDown} /></div>
					</div>

					<div className="flex gap-6 items-center mr-3">
						<p className="text-lg font-bold text-charcoal">
							Longitude: <span className="font-normal">12.44...</span>
						</p>
						<p className="text-lg font-bold text-charcoal">
							Longitude: <span className="font-normal">12.44...</span>
						</p>

					</div>

				</div>


			</div>
			test

		</Layout>
	)
}

export default Fields

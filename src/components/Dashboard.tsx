import { useProfile } from '@/hooks/useProfile'
import Layout from './Layout'
import { Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import Tasks from './Tasks'

type Dashboard = {
  setIsUpdating: Dispatch<SetStateAction<boolean>>
}

function Dashboard({ setIsUpdating }: Dashboard) {
  const { loading, fullName, zipcode, farmName, profileId, updateProfile } = useProfile()




  return (
    <Layout className='flex-col gap-3 flex-1 grid grid-rows-[fit-content,auto] relative'>

      <div className="bg-lightGreen w-full flex-1 sticky top-0 p-6 items-center flex">
        <div className="flex gap-3 justify-between w-full">
          <h2 className="text-3xl font-bold text-charcoal">Farm Overview
            <span className='text-orange mx-3'>{`//`}</span>
            <span className="font-normal">{farmName}</span>
          </h2>



          <button onClick={() => setIsUpdating(true)} className="text-tan bg-green px-3 py-2 rounded-lg flex gap-2 items-center hover:opacity-80">

            <FontAwesomeIcon icon={faPencil} /><p className="">Update</p></button>
        </div>


      </div>

      <div className="h-[3000px] overflow-y-auto p-3">body</div>

      <Tasks />

    </Layout>
  )
}

export default Dashboard

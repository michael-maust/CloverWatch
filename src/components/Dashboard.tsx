import { useProfile } from '@/hooks/useProfile'
import Layout from './Layout'

function Dashboard() {
  const { loading, fullName, zipcode, farmName, profileId, updateProfile } = useProfile()




  return (
    <Layout className='flex-col gap-3 flex-1 grid grid-rows-[fit-content,auto] relative'>

      <div className="bg-lightGreen w-full flex-1 sticky top-0 p-6 items-center flex">
        <div className="flex gap-3">
          <h2 className="text-3xl font-bold text-charcoal">Farm Overview
            <span className='text-orange mx-3'>{`//`}</span>
            <span className="font-normal">{farmName}</span>
          </h2>


          <h3 className=""></h3>
        </div>


      </div>

      <div className="h-[3000px] overflow-y-auto p-3">body</div>
      test

    </Layout>
  )
}

export default Dashboard

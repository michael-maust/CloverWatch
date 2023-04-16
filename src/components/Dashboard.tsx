import { useProfile } from '@/hooks/useProfile'
import Layout from './Layout'
import { Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import Tasks from './Tasks'
import WeatherForecast from './WeatherForecast'
import FieldMap from './map/FieldMap'
import "mapbox-gl/dist/mapbox-gl.css";

type Dashboard = {
  setIsUpdating: Dispatch<SetStateAction<boolean>>
}

function Dashboard({ setIsUpdating }: Dashboard) {
  const { loading, fullName, zipcode, farmName, profileId, updateProfile } = useProfile()




  return (
    <Layout className='flex-col flex-1 grid grid-rows-[100px,auto] relative'>

      <header className="bg-lightGreen w-full flex-1 sticky top-0 p-6 items-center flex mb-3">
        <div className="flex gap-3 justify-between w-full">
          <h2 className="text-3xl font-bold text-charcoal">Farm Overview
            <span className='text-orange mx-3'>{`//`}</span>
            <span className="font-normal">{farmName}</span>
          </h2>



          <button onClick={() => setIsUpdating(true)} className="text-tan bg-green px-3 py-2 rounded-lg flex gap-2 items-center hover:opacity-80">

            <FontAwesomeIcon icon={faPencil} /><p className="">Update</p></button>
        </div>


      </header>

      <h3 className="text-2xl pl-3 font-bold text-charcoal">Weather Forecast</h3>
      <WeatherForecast lat={40.7128} long={-74.006} />


      <div className="px-3 w-fit mx-auto  relative rounded-xl mb-[100px] mt-[25px]">
        <h3 className="text-2xl font-bold text-charcoal mb-3">Fields</h3>
        <FieldMap use='create' />
      </div>


      {/* <Tasks /> */}

    </Layout>
  )
}

export default Dashboard

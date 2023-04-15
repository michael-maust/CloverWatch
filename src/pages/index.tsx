import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Onboarding from '../components/Onboarding'
import Image from 'next/image'
import logo from 'public/logo.svg'

const FEATURES = ['Crop Rotation Scheduling', 'Soil Analysis', 'Field Mapping', 'Weather Forecasting', 'Farm Management', 'Treatment Scheduling']


const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  console.log(session)

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {!session ? (
        <div className="grid grid-cols-2  w-screen h-screen p-6 justify-center items-center">

          <div className="px-12 rounded-2xl shadow-sm bg-tan flex flex-col h-fit py-16 justify-center gap-6 border-2 border-gray">
            <Image src={logo} alt='header image' width={300} height={300} />
            <h2 className="text-5xl text-charcoal whitespace-pre font-bold">{`The Future of\nField Management`}</h2>
            <p className="max-w-[500px] text-2xl text-charcoal">CloverWatch is the modern solution for managing your fields and simplifying farm operations. </p>

            <div className="flex flex-wrap gap-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="w-fit shadow-md hover:scale-[1.01] cursor-default text-tan text-xl px-2 py-1 rounded-lg items-center  bg-charcoal">
                  {feature}
                </div>
              ))}
            </div>
          </div>


          <div className="px-12 my-auto ">
            <p className="mx-auto text-green text-center text-3xl font-bold mb-3">Modernize your farm. Join Now.</p>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />
          </div>
        </div>
      ) : (
        <Onboarding session={session} />
      )}
    </div>
  )
}

export default Home

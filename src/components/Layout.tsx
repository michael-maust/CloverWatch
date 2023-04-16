import React, { ReactNode, useCallback } from "react";
import cx from 'clsx'
import Image from 'next/image'
import whiteLogo from 'public/logo-white.svg'
import NavLinks from './NavLinks';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


type LayoutProps = {
  children: ReactNode;
  className?: string;
};

function Layout({ children, className }: LayoutProps) {
  const supabase = useSupabaseClient();

  const signout = useCallback(async () => {
    console.log('signing out')
    const { error } = await supabase.auth.signOut()
    console.log(error)
  }, [supabase.auth])


  return (
    <div className='w-screen bg-tan flex overflow-y-auto'>
      <div className="bg-charcoal max-w-[250px] w-[90vw] p-3 pt-6 flex flex-col items-center justify-between">
        <Image src={whiteLogo} alt='header image' />

        <NavLinks />

        <button onClick={() => signout()} className="px-3 py-2 text-tan underline underline-offset-1 text-lg hover:text-orange">Sign Out</button>
      </div>
      <div className={cx("overflow-y-auto", className)}>
        {children}
      </div>

    </div>)
}

export default Layout;

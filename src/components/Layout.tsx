import React, { ReactNode } from "react";
import cx from 'clsx'
import Image from 'next/image'
import whiteLogo from 'public/logo-white.svg'

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

function Layout({ children, className }: LayoutProps) {
  return (
    <div className='w-screen h-screen bg-tan flex overflow-y-auto'>
      <div className="bg-charcoal max-w-[250px] w-[90vw] p-3 flex flex-col items-center">
        <Image src={whiteLogo} alt='header image' />
      </div>
      <div className={cx("overflow-y-auto", className)}>
        {children}
      </div>

    </div>)
}

export default Layout;

import { PropsWithChildren, useEffect } from 'react'
import Footer from './Footer'
import Nav from './Nav'

type LayoutProps = {
  hideHeader?: boolean
  hideFooter?: boolean
}

const Layout = ({
  hideHeader = false,
  hideFooter = false,
  children,
}: PropsWithChildren<LayoutProps>) => {
  useEffect(() => {
    const key = localStorage.getItem('supabaseDarkMode')
    if (!key) {
      // Default to dark mode if no preference config
      document.documentElement.className = 'dark'
    } else {
      document.documentElement.className = key === 'true' ? 'dark' : ''
    }
  }, [])

  return (
    <div className='flex flex-col justify-between h-screen w-screen bg-slate-300'>
      {!hideHeader && <Nav />}
      <div className="">
        <main className='overflow-y-auto'>{children}</main>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout

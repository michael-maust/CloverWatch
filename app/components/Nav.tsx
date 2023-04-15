import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '~/lib/theme'

const Nav = () => {
  const { isDarkMode } = useTheme()

  return (
    <nav className="w-full h-24 bg-slate-800 border-b p-4">
      <Link href="/">
        <a className="flex">
          <Image
            src={
              isDarkMode
                ? '/images/supabase-logo-wordmark--dark.svg'
                : '/images/supabase-logo-wordmark--light.svg'
            }
            alt="Supabase Logo"
            height={24}
            width={120}
          />
        </a>
      </Link>
    </nav>
  )
}

export default Nav

import { useRouter } from 'next/router';
import React from 'react'
import Link from 'next/link';


const baseLinkStyle = 'text-white text-lg font-bold p-2 rounded-md hover:bg-charcoal';
const activeLinkStyle = 'bg-charcoal';

function NavLinks() {
	const router = useRouter();
	const currentRoute = router.pathname;

	return (
		<nav>
			<Link href='/' className={currentRoute === '/' ? activeLinkStyle : baseLinkStyle}>
				Overview
			</Link>

			<Link
				href='/about'
				className={currentRoute === '/fields' ? activeLinkStyle : baseLinkStyle}
			>
				Fields
			</Link>


		</nav>
	)
}

export default NavLinks

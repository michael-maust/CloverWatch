import { useRouter } from 'next/router';
import React from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faHome, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import cx from 'clsx'


type NavLinkProps = {
	href: string;
	isActive: boolean;
	label: string;
	icon: IconDefinition
}

function NavButton({ href, isActive, label, icon }: NavLinkProps) {
	return (
		<Link href={href} className={cx('', isActive && 'bg-gray-600 p-3 rounded-xl', !isActive && 'ml-3')}>
			<div className="flex items-center text-tan hover:text-orange justify-between max-w-[150px]">
				<div className="flex gap-2 items-center text-xl">
					<FontAwesomeIcon icon={icon} />
					<p className="font-bold text-xl "></p>{label}
				</div>
			</div>
		</Link>
	)
}



function NavLinks() {
	const router = useRouter();
	const currentRoute = router.pathname;

	return (
		<nav className='flex flex-col gap-6 pb-48 w-full'>
			<NavButton href='/' isActive={currentRoute === '/'} label='Overview' icon={faHome} />
			<NavButton href='/fields' isActive={currentRoute === '/fields'} label='Fields' icon={faMapLocation} />
		</nav>
	)
}

export default NavLinks

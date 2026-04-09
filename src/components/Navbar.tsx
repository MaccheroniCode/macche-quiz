import { memo } from 'react';
import { useLocation } from 'react-router';
import { APP_TITLE } from '../config/config';

const Navbar = memo(() => {
	const { pathname } = useLocation();

	return (
		<nav className="z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg sticky top-0">
			<header className="flex h-16 items-center gap-4 px-6 mx-auto">
				<div className="flex items-center gap-4">
					<img src="logo.png" height={60} width={60} />
					<p className="font-bold">
						{pathname === '/'
							? APP_TITLE
							: <a href="/" target="_blank">{APP_TITLE}</a>
						}
					</p>
				</div>
			</header>
		</nav>
	);
});

export default Navbar;

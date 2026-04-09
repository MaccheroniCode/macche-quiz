import { cn } from '@heroui/react';
import { memo, useState, type ReactNode } from 'react';
import { Link } from 'react-router';

export interface NavbarItem {
	readonly label: string;
	readonly href: string;
	readonly isActive?: boolean;
}

interface NavbarProps {
	readonly brand: ReactNode;
	readonly items: readonly NavbarItem[];
	readonly rightContent?: ReactNode;
	readonly className?: string;
	readonly maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	readonly position?: 'static' | 'sticky' | 'fixed';
}

const maxWidthClasses = {
	sm: 'max-w-[640px]',
	md: 'max-w-[768px]',
	lg: 'max-w-[1024px]',
	xl: 'max-w-[1280px]',
	'2xl': 'max-w-[1536px]',
	full: 'max-w-full',
};

const Navbar = memo<NavbarProps>(({
	brand,
	items,
	rightContent,
	className,
	maxWidth = 'xl',
	position = 'sticky',
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav
			className={cn(
				'z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg',
				position === 'sticky' && 'sticky top-0',
				position === 'fixed' && 'fixed top-0',
				className
			)}
		>
			<header
				className={cn(
					'flex h-16 items-center gap-4 px-6',
					maxWidth !== 'full' && maxWidthClasses[maxWidth],
					'mx-auto'
				)}
			>
				<div className="flex items-center gap-4">
					<button
						className="md:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
						aria-expanded={isMenuOpen}
					>
						<span className="sr-only">Menu</span>
						<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{isMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
					{brand}
				</div>
				<ul className="hidden items-center gap-4 md:flex">
					{items.map((item) => (
						<li key={item.href}>
							<Link
								to={item.href}
								className={cn(item.isActive && 'font-medium text-accent')}
								aria-current={item.isActive ? 'page' : undefined}
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
				{rightContent && <div className="hidden items-center gap-4 md:flex">{rightContent}</div>}
			</header>
			{isMenuOpen && (
				<div className="border-t border-separator md:hidden">
					<ul className="flex flex-col gap-2 p-4">
						{items.map((item) => (
							<li key={item.href}>
								<Link
									to={item.href}
									className={cn(
										'block py-2',
										item.isActive && 'font-medium text-accent'
									)}
								>
									{item.label}
								</Link>
							</li>
						))}
						{rightContent && (
							<li className="mt-4 flex flex-col gap-2 border-t border-separator pt-4">
								{rightContent}
							</li>
						)}
					</ul>
				</div>
			)}
		</nav>
	);
});

export default Navbar;

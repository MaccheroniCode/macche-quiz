import { memo } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Navbar, { type NavbarItem } from './components/Navbar';
import { APP_TITLE } from './config/config';
import IndexPage from './pages/IndexPage';
import QuizPage from './pages/QuizPage';

const MENU_ITEMS: readonly NavbarItem[] = [];

const App = memo(() => {
	const { pathname } = useLocation();

	return <>
		<Navbar
			brand={
				<>
					<img src="logo.png" height={60} width={60} />
					<p className="font-bold">
						{pathname === '/'
							? APP_TITLE
							: <a href="/" target="_blank">{APP_TITLE}</a>
						}
					</p>
				</>
			}
			items={MENU_ITEMS.map(item => {
				if (item.href === pathname) {
					return {
						...item,
						isActive: true,
					};
				}
				return item;
			})}
			maxWidth="full"
			rightContent={<></>}
		/>
		<Routes>
			<Route index element={<IndexPage />} />
			<Route path="/quiz/:id" element={<QuizPage />} />
		</Routes>
		<footer className="text-center mt-10">
			&copy;<span id="copy-year">2026</span> <a href="https://maccheronicode.it" target="_blank">Maccheroni Code</a>
		</footer>
	</>;
});

export default App;

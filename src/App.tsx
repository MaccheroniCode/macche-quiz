import { memo } from 'react';
import { Route, Routes } from 'react-router';
import Navbar from './components/Navbar';
import IndexPage from './pages/IndexPage';
import QuizPage from './pages/QuizPage';

const App = memo(() => <>
	<Navbar />
	<Routes>
		<Route index element={<IndexPage />} />
		<Route path="/quiz/:id" element={<QuizPage />} />
	</Routes>
	<footer className="mt-10 mx-2 mb-2 sm:container sm:mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-18 justify-items-center md:justify-items-end">
		<div>
			&copy;{new Date().getFullYear()}&nbsp;<a href="https://maccheronicode.it" target="_blank">Maccheroni&nbsp;Code</a>
		</div>
		<a className="flex items-center md:me-auto" href="https://github.com/MaccheroniCode/macche-quiz" target="_blank">
			Discover&nbsp;on&nbsp;&nbsp;<img className="h-4" src="social/GitHub_Lockup_White.svg" alt="GitHub" title="GitHub" />
		</a>
	</footer>
</>);

export default App;

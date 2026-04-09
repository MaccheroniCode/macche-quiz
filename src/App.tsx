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
	<footer className="text-center mt-10">
		&copy;<span id="copy-year">2026</span> <a href="https://maccheronicode.it" target="_blank">Maccheroni Code</a>
	</footer>
</>);

export default App;

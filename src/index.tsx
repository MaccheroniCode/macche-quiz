import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('app')!)
	.render(
		<HashRouter>
			<App />
		</HashRouter>
	);

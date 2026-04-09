import { useEffect } from 'react';
import { APP_TITLE } from '../config/config';

export const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = [
			APP_TITLE,
			title
		].filter(Boolean).join(' - ');
	}, [title]);
};

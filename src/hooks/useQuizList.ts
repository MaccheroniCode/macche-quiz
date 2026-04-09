import yaml from 'js-yaml';
import { useEffect, useState } from 'react';

export interface QuizList {
	readonly quizzes: readonly Quiz[];
}

export interface Quiz {
	readonly id: string;
	readonly name: string;
}

export interface QuizListState {
	readonly loading?: boolean;
	readonly data?: QuizList;
	readonly error?: boolean;
}

export const useQuizList = () => {
	const [state, setState] = useState<QuizListState>({ loading: true });

	useEffect(() => {
		setTimeout(() => {
			fetch('quiz/list.yaml')
				.then(response => response.blob())
				.then(blob => blob.text())
				.then(text => yaml.load(text) as QuizList)
				.then(data => {
					setState({ data });
				})
				.catch(err => {
					setState({ error: true });
					console.log('err:', err);
				});
		}, (Math.random() * 500) + 500);
	}, []);

	return state;
};

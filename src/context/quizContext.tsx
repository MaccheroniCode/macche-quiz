import yaml from 'js-yaml';
import { createContext, memo, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface Quiz {
	readonly name: string;
	readonly questions: readonly Question[];
}

// eslint-disable-next-line react-refresh/only-export-components
export enum FinalizedState {
	CORRECT,
	WRONG,
	PARTIAL,
}

export interface Question {
	readonly heading: string;
	readonly multi?: boolean;
	readonly answares: readonly Answare[];
	readonly finalizedState?: FinalizedState;
}

export interface Answare {
	readonly answare: string;
	readonly correct?: boolean;
	readonly selected?: boolean;
}

export interface Results {
	readonly correctNumber: number;
}

export interface QuizState {
	readonly questionIndex: number;
	readonly quiz: Quiz | null;
	readonly results: Results | null;
	readonly error: null;
}

export interface QuizContextType {
	readonly id: string | null;
	readonly name: Quiz['name'];
	readonly currentQuestion: Quiz['questions'][0];
	readonly currentQuestionIndex: number;
	readonly totalQuestions: number;
	readonly questions: Quiz['questions'];
	readonly results: QuizState['results'];
	readonly showResults: boolean;
	readonly error: null;
}

export interface QuizHandlerContextType {
	readonly changeQuestion: (questionIndex: number) => void;
	readonly toggleAnsware: (answareIndex: number) => void;
	readonly finalize: () => void;
}

export interface QuizProviderProps {
	readonly id?: string;
	readonly children: ReactNode;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);
const QuizHandlerContext = createContext<QuizHandlerContextType | undefined>(undefined);

export const QuizProvider = memo<QuizProviderProps>(({ id, children }) => {
	const [{
		questionIndex,
		quiz,
		results,
		error,
	}, setState] = useState<QuizState>({
		questionIndex: 0,
		quiz: null,
		results: null,
		error: null,
	});
	const { name, questions = [] } = quiz ?? {};

	const load = useCallback(() => {
		fetch(`quiz/${id}.yaml`)
			.then(response => response.blob())
			.then(blob => blob.text())
			.then(text => yaml.load(text) as Quiz)
			.then(data => {
				setState((state) =>
				({
					...state,
					questionIndex: 0,
					quiz: data,
				}));
			})
			.catch(err => console.log('err:', err));
	}, [id]);

	useEffect(() => {
		if (id) {
			load();
		}
	}, [id]);

	const handler = useMemo<QuizHandlerContextType>(() => ({
		changeQuestion: (questionIndex) => {
			setState((state) => ({ ...state, questionIndex: questionIndex - 1 }));
		},
		toggleAnsware: (answareIndex) => {
			setState((state) => {
				const { quiz, questionIndex } = state;
				if (!quiz) {
					return state;
				}

				return ({
					...state,
					quiz: {
						...quiz,
						questions: quiz.questions.map((question, qi) => {
							if (qi !== questionIndex) {
								return question;
							}
							let { answares } = question;
							if (question.multi || answares[answareIndex].selected) {
								answares = answares.map((answare, ai) => {
									if (ai !== answareIndex) {
										return answare;
									}
									return { ...answare, selected: !answare.selected };
								});
							} else {
								answares = answares.map((answare, ai) => {
									const selected = ai === answareIndex;
									if (selected === answare.selected) {
										return answare;
									}
									return { ...answare, selected };
								});
							}
							return { ...question, answares };
						}),
					}
				});
			});
		},
		finalize: () => {
			setState((state) => {
				const { quiz } = state;
				if (!quiz) {
					throw new Error('Non va. Meglio se vai a farti una pippa... Grazie e cordiali saluti!');
				}

				const resultIndex = quiz.questions.length;

				if (state.results) {
					return {
						...state,
						questionIndex: resultIndex,
					};
				}

				let correctNumber = 0;

				const questions = quiz.questions.map((question) => {
					const { answares, multi } = question;
					let finalizedState = FinalizedState.PARTIAL;
					if (answares.every(a => !!a.correct === !!a.selected)) {
						finalizedState = FinalizedState.CORRECT;
						correctNumber++;
					} else if (!multi || answares.every(a => !!a.correct !== !!a.selected)) {
						finalizedState = FinalizedState.WRONG;
					}
					return { ...question, finalizedState };
				});
				return {
					...state,
					questionIndex: resultIndex,
					quiz: {
						...quiz,
						questions,
					},
					results: {
						correctNumber,
					},
				};
			});
		},
	}), []);

	const data = useMemo<QuizContextType>(() => ({
		id: id ?? null,
		name: name ?? '',
		currentQuestion: questions?.[questionIndex],
		currentQuestionIndex: questionIndex + 1,
		totalQuestions: questions?.length,
		questions: [...questions ?? []],
		results,
		showResults: !!results && questionIndex >= questions?.length,
		error,
	}), [id, name, questionIndex, questions, results, error]);

	return (
		<QuizHandlerContext.Provider value={handler}>
			<QuizContext.Provider value={data}>
				{children}
			</QuizContext.Provider>
		</QuizHandlerContext.Provider>
	);
});

// eslint-disable-next-line react-refresh/only-export-components
export const useQuiz = () => {
	const context = useContext(QuizContext);
	if (context === undefined) {
		throw new Error('useQuiz must be used within a <QuizProvider />');
	}
	return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useQuizHandler = () => {
	const context = useContext(QuizHandlerContext);
	if (context === undefined) {
		throw new Error('useQuizHandler must be used within a <QuizProvider />');
	}
	return context;
};

import { Card, Checkbox, Label, ProgressCircle, Separator } from '@heroui/react';
import { memo, useCallback } from 'react';
import { useParams } from 'react-router';
import MarkdownContent from '../components/MarkdownContent';
import QuestionNavigator from '../components/QuestionNavigator';
import { FinalizedState, QuizProvider, useQuiz, useQuizHandler, type Answare } from '../context/quizContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { classNames } from '../util/ui';

interface AnswareContainerProps {
	readonly answare: Answare;
	readonly answareIndex: number;
}

const AnswareItem = memo<AnswareContainerProps>(({ answare, answareIndex }) => {
	const { answare: answareMarkdown, selected, correct } = answare ?? {};

	const { results } = useQuiz();

	const { toggleAnsware } = useQuizHandler();

	const handleChange = useCallback(() => {
		toggleAnsware(answareIndex);
	}, [toggleAnsware, answareIndex]);

	let background = 'bg-surface-secondary';
	if (results) {
		if (correct) {
			background = 'bg-green-800';
		} else if (selected) {
			background = 'bg-red-800';
		}
	}

	return (
		<Checkbox
			value={`${answareIndex}`}
			variant="primary"
			className={`rounded-3xl px-5 py-4 transition-all border-3 data-[selected=true]:border-accent/80 ${background}`}
			isSelected={selected}
			onChange={results ? undefined : handleChange}
		>
			<Checkbox.Content className="block w-full">
				<MarkdownContent markdown={answareMarkdown} />
			</Checkbox.Content>
		</Checkbox>
	);
});

const QuizQuestion = memo(() => {
	const { currentQuestion, currentQuestionIndex } = useQuiz();

	const { heading, multi, answares = [], finalizedState } = currentQuestion ?? {};

	let borderColor;
	if (finalizedState === FinalizedState.CORRECT) {
		borderColor = 'border-green-800';
	} else if (finalizedState === FinalizedState.WRONG) {
		borderColor = 'border-red-800';
	} else if (finalizedState === FinalizedState.PARTIAL) {
		borderColor = 'border-amber-600';
	}

	return (
		<Card className={classNames(['my-8 border-3', borderColor])}>
			<MarkdownContent markdown={heading} />
			<div className='text-sm text-cyan-500'>
			  {multi ? "Select all the correct answers." : "Select the correct answer."}
			</div>
			<div className="flex flex-col gap-4 mt-4">
				{answares.map((answare, i) => (
					<AnswareItem key={`${currentQuestionIndex}~${i}`} answare={answare} answareIndex={i} />
				))}
			</div>
		</Card>
	);
});

const QuizResults = memo(() => {
	const { results, totalQuestions } = useQuiz();

	const { correctNumber = 0 } = results ?? {};

	const percent = Math.round(100 / totalQuestions * correctNumber);

	return (
		<Card className="my-8 items-center">
			<div className="text-2xl">Results</div>
			<Separator />
			<div className="flex items-center justify-center gap-3 mt-4">
				<ProgressCircle aria-label="Correct" size="lg" color="success" value={percent}>
					<ProgressCircle.Track>
						<ProgressCircle.TrackCircle />
						<ProgressCircle.FillCircle />
					</ProgressCircle.Track>
				</ProgressCircle>
				<Label>{percent}% Correct ({correctNumber} of {totalQuestions})</Label>
			</div>
		</Card>
	);
});

const QuizPageContainer = memo(() => {
	const { name, currentQuestionIndex, totalQuestions, showResults, results } = useQuiz();

	usePageTitle(name || 'Loading quiz...');

	const { changeQuestion, finalize } = useQuizHandler();

	const handleQuestionChange = useCallback((questionIndex: number) => {
		changeQuestion(questionIndex);
	}, [changeQuestion]);

	const handleFinishPress = useCallback(() => {
		finalize();
	}, [finalize]);

	return (
		<div className="mx-2 sm:container sm:mx-auto mt-2">
			<div className="text-3xl text-center">{name}</div>
			{showResults
				? <QuizResults />
				: <QuizQuestion />
			}
			<QuestionNavigator
				currentIndex={currentQuestionIndex}
				total={totalQuestions}
				finalized={!!results}
				onChange={handleQuestionChange}
				onFinish={handleFinishPress}
			/>
		</div>
	);
});

const QuizPage = memo(() => {
	const { id } = useParams();

	return (
		<QuizProvider id={id}>
			<QuizPageContainer />
		</QuizProvider>
	);
});

export default QuizPage;

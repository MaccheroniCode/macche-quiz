import { Card, Checkbox, cn, Label, ProgressCircle, Separator } from '@heroui/react';
import { memo, useCallback } from 'react';
import { useParams } from 'react-router';
import MarkdownContent from '../components/MarkdownContent';
import QuestionNavigator from '../components/QuestionNavigator';
import { FinalizedState, QuizProvider, QuizSection, useQuiz, useQuizHandler, type Answer } from '../context/quizContext';
import { usePageTitle } from '../hooks/usePageTitle';
import Loader from '../components/Loader';

const QuizIntro = memo(() => {
	const { intro } = useQuiz();

	return (
		<Card className="my-8 border-3'">
			<div className="flex flex-col gap-4">
				<MarkdownContent markdown={intro} />
			</div>
		</Card>
	);
});

interface AnswerContainerProps {
	readonly answer: Answer;
	readonly answerIndex: number;
}

const AnswerItem = memo<AnswerContainerProps>(({ answer, answerIndex }) => {
	const { answer: answerMarkdown, selected, correct } = answer ?? {};

	const { results } = useQuiz();

	const { toggleAnswer } = useQuizHandler();

	const handleChange = useCallback(() => {
		toggleAnswer(answerIndex);
	}, [toggleAnswer, answerIndex]);

	let style = 'bg-surface-secondary';
	if (results) {
		if (correct) {
			style = 'bg-green-800';
		} else if (selected) {
			style = 'bg-red-800';
		}
		style += ' cursor-default';
	}

	return (
		<Checkbox
			value={`${answerIndex}`}
			variant="primary"
			className={`rounded-3xl px-5 py-4 transition-all border-3 data-[selected=true]:border-accent/80 ${style}`}
			isReadOnly={!!results}
			isSelected={selected ?? false}
			onChange={results ? undefined : handleChange}
		>
			<Checkbox.Content className="block w-full">
				<MarkdownContent markdown={answerMarkdown} />
			</Checkbox.Content>
		</Checkbox>
	);
});

const QuizQuestion = memo(() => {
	const { currentQuestion, currentQuestionIndex } = useQuiz();

	const { heading, multi, answers = [], finalizedState } = currentQuestion ?? {};

	let borderColor;
	if (finalizedState === FinalizedState.CORRECT) {
		borderColor = 'border-green-800';
	} else if (finalizedState === FinalizedState.WRONG) {
		borderColor = 'border-red-800';
	} else if (finalizedState === FinalizedState.PARTIAL) {
		borderColor = 'border-amber-600';
	}

	return (
		<Card className={cn(['my-8 border-3', borderColor])}>
			<MarkdownContent markdown={heading} />
			<div className='text-sm text-cyan-500'>
				{multi ? 'Select all the correct answers.' : 'Select the correct answer.'}
			</div>
			<div className="flex flex-col gap-4 mt-4">
				{answers.map((answer, i) => (
					<AnswerItem key={`${currentQuestionIndex}~${i}`} answer={answer} answerIndex={i} />
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
			<div className="flex flex-col items-center justify-center gap-5 mt-4">
				<div className="relative">
					<ProgressCircle className="custom-xxxl" aria-label="Correct" color="success" value={percent}>
						<ProgressCircle.Track>
							<ProgressCircle.TrackCircle />
							<ProgressCircle.FillCircle />
						</ProgressCircle.Track>
					</ProgressCircle>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl leading-none text-box-trim-end">{percent}%</div>
				</div>
				<Label>You got {correctNumber} out of {totalQuestions} right</Label>
			</div>
		</Card>
	);
});

const SECTIONS = {
	[QuizSection.Intro]: QuizIntro,
	[QuizSection.Questions]: QuizQuestion,
	[QuizSection.Results]: QuizResults,
} as const;

const QuizPageContent = memo(() => {
	const { name, currentQuestionIndex, totalQuestions, section, results } = useQuiz();

	usePageTitle(name || 'Loading quiz...');

	const { showIntro, changeQuestion, finalize } = useQuizHandler();

	const handleIntroPress = useCallback(() => {
		showIntro();
	}, [showIntro]);

	const handleQuestionChange = useCallback((questionIndex: number) => {
		changeQuestion(questionIndex);
	}, [changeQuestion]);

	const handleFinishPress = useCallback(() => {
		finalize();
	}, [finalize]);

	const Content = SECTIONS[section];

	return <>
		<div className="text-3xl text-center">{name}</div>
		<Content />
		<QuestionNavigator
			currentIndex={currentQuestionIndex}
			total={totalQuestions}
			finalized={!!results}
			onIntro={handleIntroPress}
			onChange={handleQuestionChange}
			onFinish={handleFinishPress}
		/>
	</>;
});

const QuizPageDispatcher = memo(() => {
	const { loading, error } = useQuiz();

	if (loading) {
		return (
			<Loader className="mt-5" />
		);
	}

	if (error) {
		return <>
			<div className="text-4xl text-center text-red-600">Oh ho! Macche...happened?</div>
			<div className="text-3xl text-center text-red-700">Something went wrong!</div>
			<div className="text-2xl text-center text-red-800">A maccherone is escaped!</div>
			{error?.message && (
				<div className="mt-10">
					<MarkdownContent markdown={'```text\r\n' + error?.message + '\r\n```'} />
				</div>
			)}
		</>;
	}

	return (
		<QuizPageContent />
	);
});

const QuizPage = memo(() => {
	const { id } = useParams();

	return (
		<QuizProvider id={id}>
			<div className="mx-2 sm:container sm:mx-auto mt-2">
				<QuizPageDispatcher />
			</div>
		</QuizProvider>
	);
});

export default QuizPage;

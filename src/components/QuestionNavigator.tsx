import { Pagination } from '@heroui/react';
import { memo, useCallback } from 'react';

interface LinkProps {
	readonly isActive?: boolean;
	readonly index: number;
	readonly onChange?: (index: number) => void;
}

const Link = memo<LinkProps>(({ isActive, index, onChange }) => {
	const handlePress = useCallback(() => {
		if (onChange) {
			onChange(index);
		}
	}, [index, onChange]);

	return (
		<Pagination.Link isActive={isActive} onPress={handlePress}>{index}</Pagination.Link>
	);
});

interface QuestionNavigatorProps {
	readonly currentIndex: number;
	readonly total: number;
	readonly finalized: boolean;
	readonly onIntro: () => void;
	readonly onChange?: LinkProps['onChange'];
	readonly onFinish: () => void;
}

const ELLIPSIS = 'ellipsis';

const range = (start: number, end: number) => {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const getQuestionNumbers = (currentIndex: number, total: number): Array<number | typeof ELLIPSIS> => {
	if (!total || total <= 0) {
		return [];
	}

	if (total <= 5) {
		return range(1, total);
	}

	const start = Math.max(Math.min(currentIndex, total - 2), 3);
	const end = Math.min(Math.max(currentIndex, 3), total - 2);

	return [
		1,
		start > 3 ? ELLIPSIS : 2,
		...range(start, end),
		end < total - 2 ? ELLIPSIS : total - 1,
		total,
	];
};

const QuestionNavigator = memo<QuestionNavigatorProps>(({ currentIndex, total, finalized, onIntro, onChange, onFinish }) => {
	const handlePrevPress = useCallback(() => {
		if (onChange) {
			onChange(Math.max(1, currentIndex - 1));
		}
	}, [currentIndex, onChange]);

	const handleNextPress = useCallback(() => {
		if (onChange) {
			onChange(Math.min(total, currentIndex + 1));
		}
	}, [currentIndex, total, onChange]);

	const isLast = currentIndex >= total;

	return (
		<div className="w-full max-w-full overflow-x-auto">
			<Pagination className="grid grid-flow-col grid-cols-[1fr auto 1fr] justify-center">
				<Pagination.Content className="col-start-1 row-start-2 sm:row-start-1">
					<Pagination.Item>
						<Pagination.Next isDisabled={currentIndex <= 0} onPress={onIntro}>
							<span>Intro</span>
						</Pagination.Next>
					</Pagination.Item>
				</Pagination.Content>
				<Pagination.Content className="col-start-1 col-span-3 sm:col-start-2 sm:col-span-1">
					<Pagination.Item>
						<Pagination.Previous isDisabled={currentIndex <= 1} onPress={handlePrevPress}>
							<Pagination.PreviousIcon />
						</Pagination.Previous>
					</Pagination.Item>
					{getQuestionNumbers(currentIndex, total).map((index, i) =>
						index === ELLIPSIS ? (
							<Pagination.Item key={`ellipsis-${i}`}>
								<Pagination.Ellipsis />
							</Pagination.Item>
						) : (
							<Pagination.Item key={index}>
								<Link isActive={index === currentIndex} index={index} onChange={onChange} />
							</Pagination.Item>
						),
					)}
					<Pagination.Item>
						<Pagination.Next isDisabled={isLast} onPress={handleNextPress}>
							<Pagination.NextIcon />
						</Pagination.Next>
					</Pagination.Item>
				</Pagination.Content>
				<Pagination.Content className="col-start-3 row-start-2 sm:row-start-1">
					<Pagination.Item>
						<Pagination.Next isDisabled={finalized ? currentIndex > total : !isLast} onPress={onFinish}>
							<span>{finalized ? 'Results' : 'Finish!'}</span>
						</Pagination.Next>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination>
		</div>
	);
});

export default QuestionNavigator;

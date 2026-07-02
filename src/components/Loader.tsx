import { cn, Spinner } from '@heroui/react';
import { memo } from 'react';

interface LoaderProps {
	readonly className?: string;
}

const Loader = memo<LoaderProps>(({ className }) => {
	return (
		<div className={cn('flex flex-col items-center', className)}>
			<div className="mb-5">Looking in the fridge for the quizzes' ingredients O_O</div>
			<Spinner size="xl" />
		</div>
	);
});

export default Loader;

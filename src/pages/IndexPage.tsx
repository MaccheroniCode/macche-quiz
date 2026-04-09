import { Alert, Button, Spinner } from '@heroui/react';
import { memo, useCallback } from 'react';
import { Link } from 'react-router';
import { APP_TITLE } from '../config/config';
import { usePageTitle } from '../hooks/usePageTitle';
import { useQuizList } from '../hooks/useQuizList';

const Quizzes = memo(() => {
	const { loading, data: { quizzes } = {}, error } = useQuizList();

	const handleReload = useCallback(() => {
		location.reload();
	}, []);

	if (loading) {
		return (
			<div className="flex flex-col items-center mt-5">
				<div className="mb-5">Looking in the fridge for the quizzes' ingredients O_O</div>
				<Spinner size="xl" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="grid w-full max-w-xs gap-4 mx-auto mt-5">
				<Alert status="danger">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>¯\_(ツ)_/¯&nbsp;&nbsp;&nbsp;Sorry!</Alert.Title>
						<Alert.Description>
							We're currently unable to load the quizzes list, and we don't know why :(
						</Alert.Description>
						<Button className="mt-2" size="sm" variant="danger" onPress={handleReload}>
							Try reloading the page
						</Button>
					</Alert.Content>
				</Alert>
			</div>
		);
	}

	if (!quizzes || quizzes.length === 0) {
		return (
			<div className="mt-5 text-center">No quizzes available right now, but we are cooking them ;)</div>
		);
	}

	return <>
		<div className="mt-5 text-center">Enjoy one or more freshly made quizzes:</div>
		<div className="flex flex-row max-w-md justify-center mx-auto mt-3">
			<ul className="flex flex-col gap-2 list-none">
				{quizzes?.map(({ id, name }) => (
					<li key={id}>
						<Link className="link" to={`/quiz/${id}`}>&gt; {name}</Link>
					</li>
				))}
			</ul>
		</div>
	</>;
});

const IndexPage = memo(() => {
	usePageTitle('');

	return (
		<div className="mx-2 sm:container sm:mx-auto justify-center mt-2">
			<div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4 my-5">
				<img className="md:col-span-2 md:col-start-2 xl:col-start-3" src="logo.png" />
			</div>
			<h1 className="text-4xl text-center">{APP_TITLE}</h1>
			<Quizzes />
			<div className="flex items-center justify-center mt-20">
				<a className="social-link yt" href="https://www.youtube.com/@MaccheroniCode" target="_blank">
					<img src="social/yt_logo_fullcolor_white_digital.png" alt="YouTube" title="YouTube" />
				</a>
				<a className="social-link" href="https://open.spotify.com/show/2kkWrwjHTEousBZ3MT1izR" target="_blank">
					<img src="social/Spotify_Full_Logo_Green.svg" alt="Spotify" title="Spotify" />
				</a>
			</div>
		</div>
	);
});

export default IndexPage;

import { ReactNode, useCallback, useEffect, useState } from 'react';
import en from '../../public/en.json';
import { randomInt } from '@/utils/utils';
import TypingText from '../TypingText/TypingText';

export default function TypingController({
	onMove,
	children,
}: {
	onMove: (direction: string) => void;
	children: ReactNode;
}) {
	const [moveUpWords, setMoveUpWords] = useState(['', '']);
	const [moveDownWords, setMoveDownWords] = useState(['', '']);
	const [moveLeftWords, setMoveLeftWords] = useState(['', '']);
	const [moveRightWords, setMoveRightWords] = useState(['', '']);
	const [currentDirection, setCurrentDirection] = useState<
		'up' | 'down' | 'left' | 'right' | null
	>(null);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [totalCorrectChars, setTotalCorrectChars] = useState(0);
	const [totalIncorrectChars, setTotalIncorrectChars] = useState(0);
	const [totalAccuracy, setTotalAccuracy] = useState(0);
	const [wpm, setWpm] = useState(0);
	const [moves, setMoves] = useState(0);

	const getRandomUniqueWord = useCallback((words: string[]) => {
		const randomWord = en.words[randomInt(0, en.words.length - 1)];

		if (
			words.find((word) => word === randomWord || word[0] === randomWord[0])
		) {
			return getRandomUniqueWord(words);
		}

		return randomWord;
	}, []);

	useEffect(() => {
		const newMoveWords = new Array(8).fill('');
		for (let i = 0; i < newMoveWords.length; i++) {
			newMoveWords[i] = getRandomUniqueWord(newMoveWords);
		}

		setMoveUpWords([newMoveWords[0], newMoveWords[1]]);
		setMoveDownWords([newMoveWords[2], newMoveWords[3]]);
		setMoveLeftWords([newMoveWords[4], newMoveWords[5]]);
		setMoveRightWords([newMoveWords[6], newMoveWords[7]]);
	}, [getRandomUniqueWord]);

	const handleOnStart = (_startTime: Date) => {
		if (startTime == null) {
			setStartTime(_startTime);
		}
	};

	const handleOnReset = () => {
		if (currentDirection === 'up') {
			const newWord = getRandomUniqueWord([
				...moveDownWords,
				...moveLeftWords,
				...moveRightWords,
				moveUpWords[1],
			]);
			setMoveUpWords([moveUpWords[1], newWord]);
		} else if (currentDirection === 'down') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveLeftWords,
				...moveRightWords,
				moveDownWords[1],
			]);
			setMoveDownWords([moveDownWords[1], newWord]);
		} else if (currentDirection === 'left') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveRightWords,
				moveLeftWords[1],
			]);
			setMoveLeftWords([moveLeftWords[1], newWord]);
		} else if (currentDirection === 'right') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveLeftWords,
				moveRightWords[1],
			]);
			setMoveRightWords([moveRightWords[1], newWord]);
		}

		setCurrentDirection(null);
	};

	const handleOnWordTyped = (
		word: string,
		typeTime: number,
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => {
		console.log('Finished in ', typeTime);
		if (currentDirection === 'up') {
			const newWord = getRandomUniqueWord([
				...moveDownWords,
				...moveLeftWords,
				...moveRightWords,
				moveUpWords[1],
			]);
			setMoveUpWords([moveUpWords[1], newWord]);
			onMove('up');
		} else if (currentDirection === 'down') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveLeftWords,
				...moveRightWords,
				moveDownWords[1],
			]);
			setMoveDownWords([moveDownWords[1], newWord]);
			onMove('down');
		} else if (currentDirection === 'left') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveRightWords,
				moveLeftWords[1],
			]);
			setMoveLeftWords([moveLeftWords[1], newWord]);
			onMove('left');
		} else if (currentDirection === 'right') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveLeftWords,
				moveRightWords[1],
			]);
			setMoveRightWords([moveRightWords[1], newWord]);
			onMove('right');
		}

		const newTotalCorrectChars = totalCorrectChars + correctChars;
		setTotalCorrectChars(newTotalCorrectChars);
		const newTotalIncorrectChars = totalIncorrectChars + incorrectChars;
		setTotalIncorrectChars(newTotalIncorrectChars);
		setTotalAccuracy(
			newTotalCorrectChars / (newTotalCorrectChars + newTotalIncorrectChars),
		);
		const totalTime = startTime
			? (endTime.getTime() - startTime.getTime()) / 1000
			: 0;

		const currentWpm = newTotalCorrectChars / 5 / (totalTime / 60);
		console.log(
			startTime,
			endTime,
			totalTime,
			currentWpm,
			newTotalCorrectChars,
		);
		setWpm(currentWpm);
		setCurrentDirection(null);
		setMoves((v) => v + 1);
	};

	const handleCheckDirection = (
		direction: 'up' | 'down' | 'left' | 'right',
		isCorrect: boolean,
	) => {
		if (isCorrect) {
			console.log('Set new direction: ', direction);
			setCurrentDirection(direction);
		}
	};

	return (
		<div className="grid grid-cols-3 grid-rows-3 items-center justify-items-center">
			<div className="flex flex-col items-center col-start-2">
				<div className="flex">
					<div>Correct chars: {totalCorrectChars}</div>
					<div>Incorrect chars: {totalIncorrectChars}</div>
					<div>Current wpm: {Math.round(wpm)}</div>
					<div>Accuracy: {Math.round(totalAccuracy * 100)}%</div>
					<div>Current direction: {currentDirection}</div>
					<div>Moves: {moves}</div>
				</div>
				<div>
					<div>Up</div>
					<TypingText
						key={'up' + moveUpWords[0]}
						words={moveUpWords}
						direction={'up'}
						currentDirection={currentDirection}
						onWordTyped={handleOnWordTyped}
						onStart={handleOnStart}
						onReset={handleOnReset}
						onCheckDirection={handleCheckDirection}
					/>
				</div>
			</div>
			<div className="col-start-2 row-start-2">{children}</div>
			<div className="col-start-2 row-start-3">
				<div>Down</div>
				<TypingText
					key={'down' + moveDownWords[0]}
					words={moveDownWords}
					direction={'down'}
					currentDirection={currentDirection}
					onWordTyped={handleOnWordTyped}
					onStart={handleOnStart}
					onReset={handleOnReset}
					onCheckDirection={handleCheckDirection}
				/>
			</div>
			<div className="col-start-1 row-start-2">
				<div>Left</div>
				<TypingText
					key={'left' + moveLeftWords[0]}
					words={moveLeftWords}
					direction={'left'}
					currentDirection={currentDirection}
					onWordTyped={handleOnWordTyped}
					onStart={handleOnStart}
					onReset={handleOnReset}
					onCheckDirection={handleCheckDirection}
				/>
			</div>
			<div className="col-start-3 row-start-2">
				<div>Right</div>
				<TypingText
					key={'right' + moveRightWords[0]}
					words={moveRightWords}
					direction={'right'}
					currentDirection={currentDirection}
					onWordTyped={handleOnWordTyped}
					onStart={handleOnStart}
					onReset={handleOnReset}
					onCheckDirection={handleCheckDirection}
				/>
			</div>

			{/* <div>Words</div>
			<div>{moveUpWords.join(' ')}</div>
			<div>{moveDownWords.join(' ')}</div>
			<div>{moveLeftWords.join(' ')}</div>
			<div>{moveRightWords.join(' ')}</div> */}
		</div>
	);
}

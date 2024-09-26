import { useCallback, useEffect, useState } from 'react';
import en from '../../public/en.json';
import { randomInt } from '@/utils/utils';
import TypingText from '../TypingText/TypingText';

export default function TypingController() {
	const [moveUpWords, setMoveUpWords] = useState(['', '']);
	const [moveDownWords, setMoveDownWords] = useState(['', '']);
	const [moveLeftWords, setMoveLeftWords] = useState(['', '']);
	const [moveRightWords, setMoveRightWords] = useState(['', '']);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [totalCorrectChars, setTotalCorrectChars] = useState(0);
	const [totalIncorrectChars, setTotalIncorrectChars] = useState(0);
	const [wpm, setWpm] = useState(0);

	const getRandomUniqueWord = useCallback((words: string[]) => {
		const randomWord = en.words[randomInt(0, en.words.length - 1)];

		if (words.find((word) => word === randomWord)) {
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

	const handleOnWordTyped = (
		word: string,
		typeTime: number,
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => {
		console.log('Finished in ', typeTime);
		const newWord = getRandomUniqueWord([
			...moveDownWords,
			...moveLeftWords,
			...moveRightWords,
			moveUpWords[1],
		]);
		setMoveUpWords([moveUpWords[1], newWord]);
		const newTotalCorrectChars = totalCorrectChars + correctChars;
		setTotalCorrectChars(newTotalCorrectChars);
		setTotalIncorrectChars((v) => v + incorrectChars);
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
	};

	return (
		<div>
			<div>Correct chars: {totalCorrectChars}</div>
			<div>Incorrect chars: {totalIncorrectChars}</div>
			<div>Current wpm: {Math.round(wpm)}</div>
			<TypingText
				key={moveUpWords[0]}
				words={moveUpWords}
				onWordTyped={handleOnWordTyped}
				onStart={handleOnStart}
			/>

			<div>Words</div>
			<div>{moveUpWords.join(' ')}</div>
			<div>{moveDownWords.join(' ')}</div>
			<div>{moveLeftWords.join(' ')}</div>
			<div>{moveRightWords.join(' ')}</div>
		</div>
	);
}

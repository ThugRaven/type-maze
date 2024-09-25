import { useCallback, useEffect, useState } from 'react';
import en from '../../public/en.json';
import { randomInt } from '@/utils/utils';
import { TypedText } from '../TypedText/TypedText';

const regex = new RegExp('^[a-zA-Z0-9 &,._-]$');

export const TypingContainer = () => {
	const [index, setIndex] = useState(0);
	const [errorsArray, setErrorsArray] = useState<boolean[]>([]);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [endTime, setEndTime] = useState<Date | null>(null);
	const [textWpm, setTextWpm] = useState(0);
	const [currentTime, setCurrentTime] = useState<Date | null>(null);
	const [correctChars, setCorrectChars] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const [word, setWord] = useState('');

	const incorrectChars = errorsArray.filter((value) => value).length;
	const totalTime =
		startTime && currentTime
			? (currentTime.getTime() - startTime.getTime()) / 1000
			: 0;
	const currentWpm = correctChars / 5 / (totalTime / 60);

	useEffect(() => {
		const newWord = en.words[randomInt(0, en.words.length)];
		setWord(newWord);
		setErrorsArray(new Array(newWord.length).fill(false));
	}, []);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const { key } = e;
			console.log(key, e);

			if (key === 'Tab') {
				setIndex(0);
				setErrorsArray(new Array(word.length).fill(false));
				setStartTime(null);
				setEndTime(null);
				setTextWpm(0);
				setCurrentTime(null);
				setCorrectChars(0);
				setAccuracy(0);
				e.preventDefault();
				return;
			}

			if (!regex.test(key)) {
				return;
			}

			if (startTime == null && index == 0) {
				setStartTime(new Date());
			}

			if (!errorsArray[index]) {
				if (key === word[index]) {
					console.log('correct');

					setCorrectChars((c) => c + 1);
				} else {
					console.log('incorrect');

					setErrorsArray((array) =>
						array.map((error, i) => {
							if (i === index && !error) {
								return true;
							} else return error;
						}),
					);
				}
			}

			if (key === word[index]) {
				setIndex((index) => index + 1);

				if (index + 1 === word.length) {
					setEndTime(new Date());
					const fullTime = startTime
						? (new Date().getTime() - startTime.getTime()) / 1000
						: 0;
					console.log('end', fullTime);
					setStartTime(null);

					setTextWpm((correctChars + 1) / 5 / (fullTime / 60));
					setAccuracy((correctChars + 1) / word.length);
				}
			}
		},
		[index, startTime, correctChars, errorsArray, word],
	);

	useEffect(() => {
		console.log('addEventListener');
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			console.log('removeEventListener');
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	useEffect(() => {
		if (!startTime) {
			return;
		}

		const intervalId = setInterval(() => {
			console.log('update');

			setCurrentTime(new Date());
		}, 100);

		return () => {
			clearInterval(intervalId);
		};
	}, [startTime]);

	return (
		<div>
			<div>Correct chars: {correctChars}</div>
			<div>Incorrect chars: {incorrectChars}</div>
			<div>Current wpm: {Math.round(currentWpm)}</div>
			<div>Wpm: {Math.round(textWpm)}</div>
			<div>Acc: {accuracy > 0 ? Math.round(accuracy * 100) : '-'}%</div>
			<div>
				{startTime &&
					endTime &&
					(endTime.getTime() - startTime.getTime()) / 1000}
			</div>
			<div>{totalTime}</div>
			<TypedText text={word} index={index} errorsArray={errorsArray} />
		</div>
	);
};

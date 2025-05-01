import { useState } from 'react';
const regex = new RegExp('^[a-zA-Z0-9 &,._-]$');

export default function useTypeWord(
	word: string,
	onWordTyped: (typeTime: number) => void,
	onLetterTyped: (
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => void,
	onStart: (startTime: Date) => void,
	onReset: (
		word: string,
		typeTime: number,
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => void,
) {
	const wordToType = word.length > 0 ? word.concat(' ') : word;
	const [index, setIndex] = useState(0);
	const [errorsArray, setErrorsArray] = useState<boolean[]>(
		new Array(wordToType.length).fill(false),
	);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [correctChars, setCorrectChars] = useState(0);
	const incorrectChars = errorsArray.filter((value) => value).length;

	const handleCheck = (key: string) => {
		if (!regex.test(key)) {
			return false;
		}

		if (key === wordToType[index]) {
			return true;
		} else return false;
	};

	const handleType = (key: string) => {
		if (key === 'Backspace') {
			const endTime = new Date();
			const typeTime = startTime
				? (endTime.getTime() - startTime.getTime()) / 1000
				: 0;
			console.log('end', typeTime);
			setStartTime(null);
			// Penalize the user by adding one incorrect char
			onReset(wordToType, typeTime, endTime, correctChars, incorrectChars + 1);
			return;
		}

		if (!regex.test(key)) {
			return;
		}

		if (startTime == null && index == 0) {
			setStartTime(new Date());
			onStart(new Date());
		}

		let totalCorrectChars = correctChars;

		if (!errorsArray[index]) {
			if (key === wordToType[index]) {
				console.log('correct');

				totalCorrectChars++;
				onLetterTyped(new Date(), 1, 0);
				setCorrectChars(totalCorrectChars);
			} else {
				console.log('incorrect');

				onLetterTyped(new Date(), 0, 1);
				setErrorsArray((array) =>
					array.map((error, i) => {
						if (i === index && !error) {
							return true;
						} else return error;
					}),
				);
			}
		}

		if (key === wordToType[index]) {
			setIndex((index) => index + 1);

			if (index + 1 === wordToType.length) {
				const endTime = new Date();
				const typeTime = startTime
					? (endTime.getTime() - startTime.getTime()) / 1000
					: 0;
				console.log('end', typeTime);
				setStartTime(null);
				onWordTyped(typeTime);
			}
		}
	};

	return {
		word: wordToType,
		index,
		errorsArray,
		onType: handleType,
		onCheck: handleCheck,
	};
}

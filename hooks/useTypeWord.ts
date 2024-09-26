import { useState } from 'react';
const regex = new RegExp('^[a-zA-Z0-9 &,._-]$');

export default function useTypeWord(
	word: string,
	onWordTyped: (
		word: string,
		typeTime: number,
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => void,
	onStart: (startTime: Date) => void,
	onReset: () => void,
) {
	const wordToType = word.length > 0 ? word.concat(' ') : word;
	const [index, setIndex] = useState(0);
	const [errorsArray, setErrorsArray] = useState<boolean[]>(
		new Array(wordToType.length).fill(false),
	);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [correctChars, setCorrectChars] = useState(0);
	const incorrectChars = errorsArray.filter((value) => value).length;

	const handleType = (key: string) => {
		if (key === 'Backspace') {
			onReset();
			return;
		}

		if (!regex.test(key)) {
			return;
		}

		if (startTime == null && index == 0) {
			setStartTime(new Date());
			onStart(new Date());
		}

		if (!errorsArray[index]) {
			if (key === wordToType[index]) {
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

		if (key === wordToType[index]) {
			setIndex((index) => index + 1);

			if (index + 1 === wordToType.length) {
				const endTime = new Date();
				const typeTime = startTime
					? (endTime.getTime() - startTime.getTime()) / 1000
					: 0;
				console.log('end', typeTime);
				setStartTime(null);
				onWordTyped(
					wordToType,
					typeTime,
					endTime,
					correctChars + 1,
					incorrectChars,
				);
				// setTextWpm((correctChars + 1) / 5 / (fullTime / 60));
				// setAccuracy((correctChars + 1) / word.length);
			}
		}
	};

	return {
		word: wordToType,
		index,
		errorsArray,
		correctChars,
		incorrectChars,
		onType: handleType,
	};
}

import { useCallback, useEffect } from 'react';
import { TypedText } from '../TypedText/TypedText';
import useTypeWord from '@/hooks/useTypeWord';

export default function TypingText({
	words,
	direction,
	currentDirection,
	onWordTyped,
	onLetterTyped,
	onStart,
	onReset,
	onCheckDirection,
}: {
	words: string[];
	direction: 'up' | 'down' | 'left' | 'right';
	currentDirection: 'up' | 'down' | 'left' | 'right' | null;
	onWordTyped: (typeTime: number) => void;
	onLetterTyped: (
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => void;
	onStart: (startTime: Date) => void;
	onReset: (
		word: string,
		typeTime: number,
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => void;
	onCheckDirection: (
		direction: 'up' | 'down' | 'left' | 'right',
		isCorrect: boolean,
	) => void;
}) {
	const currentWord = words[0];
	const nextWord = words[1];

	const { word, index, errorsArray, onType, onCheck } = useTypeWord(
		currentWord,
		onWordTyped,
		onLetterTyped,
		onStart,
		onReset,
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const { key } = e;

			if (currentDirection === null) {
				if (onCheck(key)) {
					onCheckDirection(direction, true);
					onType(key);
				}
				return;
			}

			if (currentDirection === direction) {
				onType(key);
				return;
			}

			e.preventDefault();
		},
		[onType, direction, currentDirection, onCheck, onCheckDirection],
	);

	useEffect(() => {
		// console.log('addEventListener');
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			// console.log('removeEventListener');
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<TypedText
			text={word}
			customText={nextWord}
			index={index}
			errorsArray={errorsArray}
		/>
	);
}

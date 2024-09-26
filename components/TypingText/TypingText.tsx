import { useCallback, useEffect } from 'react';
import { TypedText } from '../TypedText/TypedText';
import useTypeWord from '@/hooks/useTypeWord';

export default function TypingText({
	words,
	onWordTyped,
	onStart,
}: {
	words: string[];
	onWordTyped: (
		word: string,
		typeTime: number,
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => void;
	onStart: (startTime: Date) => void;
}) {
	const currentWord = words[0];
	const nextWord = words[1];

	const { word, index, errorsArray, correctChars, incorrectChars, onType } =
		useTypeWord(currentWord, onWordTyped, onStart, () => {
			console.log('onReset');
		});

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const { key } = e;
			console.log(key, e);

			onType(key);
		},
		[onType],
	);

	useEffect(() => {
		console.log('addEventListener');
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			console.log('removeEventListener');
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

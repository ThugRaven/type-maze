import { useCallback, useEffect, useState } from 'react';
import en from '../../public/en.json';
import { randomInt } from '@/utils/utils';

export default function TypingController() {
	const [moveUpWords, setMoveUpWords] = useState(['', '']);
	const [moveDownWords, setMoveDownWords] = useState(['', '']);
	const [moveLeftWords, setMoveLeftWords] = useState(['', '']);
	const [moveRightWords, setMoveRightWords] = useState(['', '']);

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

	return (
		<div>
			<div>{moveUpWords.join(' ')}</div>
			<div>{moveDownWords.join(' ')}</div>
			<div>{moveLeftWords.join(' ')}</div>
			<div>{moveRightWords.join(' ')}</div>
		</div>
	);
}

'use client';

import MazeGenerator from '@/classes/MazeGenerator';
import TypingController from '@/components/TypingController/TypingController';
import { getDailySeed, random } from '@/utils/utils';
import { useState } from 'react';

let mazeGenerator = new MazeGenerator(getDailySeed());

export default function Page() {
	const [gameId, setGameId] = useState(random(0, 1));

	const handleOnRestart = () => {
		setGameId(random(0, 1));
		mazeGenerator = new MazeGenerator(getDailySeed());
	};

	return (
		<div className="font-mono">
			<TypingController
				mazeGenerator={mazeGenerator}
				key={gameId}
				onRestart={handleOnRestart}
			/>
		</div>
	);
}

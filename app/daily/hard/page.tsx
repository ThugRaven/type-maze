'use client';

import MazeGenerator from '@/classes/MazeGenerator';
import TypingController from '@/components/TypingController/TypingController';
import { getDailySeed } from '@/utils/utils';

const mazeGenerator = new MazeGenerator(getDailySeed(), 15, 15);

export default function Page() {
	return (
		<div className="font-mono">
			<TypingController mazeGenerator={mazeGenerator} />
		</div>
	);
}

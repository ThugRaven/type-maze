'use client';

import TypingController from '@/components/TypingController/TypingController';
import MazeGenerator from './classes/MazeGenerator';
import { useEffect, useRef, useState } from 'react';

// const text = 'The quick brown fox jumps over the lazy dog';
const mazeGenerator = new MazeGenerator();

export default function Home() {
	const [isGoalReached, setIsGoalReached] = useState(false);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	console.log(mazeGenerator);

	// useEffect(() => {
	// 	setMaze(mazeGenerator.draw());
	// }, [mazeGenerator]);

	useEffect(() => {
		if (ctx) {
			mazeGenerator.draw(ctx);
		}
	}, [ctx]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		setCtx(ctx);
	}, []);

	const handleOnMove = (direction: string) => {
		if (!ctx) {
			return;
		}

		console.log('move: ', direction);
		mazeGenerator.move(direction, () => {
			setIsGoalReached(true);
		});
		mazeGenerator.draw(ctx);
	};

	// const { word, index, errorsArray, correctChars, incorrectChars, onType } =
	// 	useTypeWord(
	// 		text,
	// 		(typeTime) => {
	// 			console.log('finished in ', typeTime);
	// 		},
	// 		() => {
	// 			console.log('onReset');
	// 		},
	// 	);

	// const handleKeyDown = useCallback(
	// 	(e: KeyboardEvent) => {
	// 		const { key } = e;
	// 		console.log(key, e);

	// 		onType(key);
	// 	},
	// 	[onType],
	// );

	// useEffect(() => {
	// 	console.log('addEventListener');
	// 	window.addEventListener('keydown', handleKeyDown);

	// 	return () => {
	// 		console.log('removeEventListener');
	// 		window.removeEventListener('keydown', handleKeyDown);
	// 	};
	// }, [handleKeyDown]);

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="font-mono">
					{/* <div>
						{new Intl.DateTimeFormat('en-US', {
							timeStyle: 'full',
						}).format(endTime - startTime)}
					</div> */}
					{/* <div>
						{new Date((endTime - startTime) / 1000).toLocaleTimeString()}
					</div> */}
					{/* <div>Correct chars: {correctChars}</div>
					<div>Incorrect chars: {incorrectChars}</div>
					<TypedText text={word} index={index} errorsArray={errorsArray} /> */}
					{isGoalReached && <div>You{"'"}ve won!</div>}
					<TypingController onMove={handleOnMove}>
						{/* <div className="grid grid-cols-10 grid-rows-10">{maze}</div> */}
						<canvas
							ref={canvasRef}
							width={mazeGenerator.cols * mazeGenerator.width}
							height={mazeGenerator.rows * mazeGenerator.width}
						></canvas>
					</TypingController>
					{/* <TypingContainer></TypingContainer> */}
				</div>
			</main>
		</div>
	);
}

'use client';

import TypingController from '@/components/TypingController/TypingController';
import MazeGenerator from './classes/MazeGenerator';
import { useCallback, useEffect, useRef, useState } from 'react';

// const text = 'The quick brown fox jumps over the lazy dog';
const mazeGenerator = new MazeGenerator();

export default function Home() {
	const [isGoalReached, setIsGoalReached] = useState(false);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [width, setWidth] = useState(0);
	const [cols, setCols] = useState(0);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasContainer = useRef<HTMLDivElement | null>(null);

	console.log(mazeGenerator);

	// useEffect(() => {
	// 	setMaze(mazeGenerator.draw());
	// }, [mazeGenerator]);

	const handleResize = useCallback(() => {
		console.log(window.innerWidth, window.innerHeight);

		if (canvasContainer.current && canvasRef.current && ctx) {
			console.log(canvasRef.current.getBoundingClientRect().width);

			const width = canvasContainer.current.getBoundingClientRect().width;
			const height = canvasContainer.current.getBoundingClientRect().height;
			console.log(width, height);

			canvasRef.current.width = Math.floor(Math.min(width, height));
			canvasRef.current.height = Math.floor(Math.min(width, height));

			const {
				width: cellWidth,
				cols: mazeCols,
				rows,
			} = mazeGenerator.updateSize(width, ctx);
			console.log(cellWidth, mazeCols);

			setWidth(cellWidth);
			setCols(mazeCols);
		}
	}, [ctx]);

	useEffect(() => {
		if (ctx) {
			handleResize();
			mazeGenerator.draw(ctx);
		}
	}, [ctx, handleResize]);

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
		const playerPos = mazeGenerator.move(direction, () => {
			setIsGoalReached(true);
		});
		mazeGenerator.draw(ctx);
		setPos(playerPos);
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]);

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
					{isGoalReached && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/85 z-10">
							<span className="text-6xl">You{"'"}ve won!</span>
						</div>
					)}
					<TypingController
						onMove={handleOnMove}
						width={width}
						cols={cols}
						pos={pos}
					>
						<div ref={canvasContainer} className="w-full h-full ">
							<canvas ref={canvasRef} className=""></canvas>
						</div>
						{/* <div className="grid grid-cols-10 grid-rows-10">{maze}</div> */}
						{/* className="w-36 h-36" */}
					</TypingController>
					{/* <TypingContainer></TypingContainer> */}
				</div>
			</main>
		</div>
	);
}

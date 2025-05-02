import MazeGenerator from '@/classes/MazeGenerator';
import useInterval from '@/hooks/useInterval';
import { formatDuration, randomInt } from '@/utils/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import en from '../../public/en.json';
import TypingText from '../TypingText/TypingText';

export default function TypingController({
	mazeGenerator,
	onRestart,
}: {
	mazeGenerator: MazeGenerator;
	onRestart: () => void;
}) {
	const [moveUpWords, setMoveUpWords] = useState(['', '']);
	const [moveDownWords, setMoveDownWords] = useState(['', '']);
	const [moveLeftWords, setMoveLeftWords] = useState(['', '']);
	const [moveRightWords, setMoveRightWords] = useState(['', '']);
	const [currentDirection, setCurrentDirection] = useState<
		'up' | 'down' | 'left' | 'right' | null
	>(null);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [totalCorrectChars, setTotalCorrectChars] = useState(0);
	const [totalIncorrectChars, setTotalIncorrectChars] = useState(0);
	const [wpm, setWpm] = useState(0);
	const [moves, setMoves] = useState(0);
	const [isTracking, setIsTracking] = useState(false);
	const [isDirectionLabelVisible] = useState(false);
	const [isGoalReached, setIsGoalReached] = useState(false);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [width, setWidth] = useState(0);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasContainer = useRef<HTMLDivElement | null>(null);
	const totalAccuracy =
		totalCorrectChars + totalIncorrectChars === 0
			? 0
			: totalCorrectChars / (totalCorrectChars + totalIncorrectChars);
	const [totalTime, setTotalTime] = useState<number | null>(null);

	const getRandomUniqueWord = useCallback((words: string[]) => {
		const randomWord = en.words[randomInt(0, en.words.length - 1)];

		if (
			words.find((word) => word === randomWord || word[0] === randomWord[0])
		) {
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

	const handleOnStart = (_startTime: Date) => {
		if (startTime == null) {
			setStartTime(_startTime);
		}
	};

	useInterval(
		() => {
			const totalTime = startTime
				? (new Date().getTime() - startTime.getTime()) / 1000
				: 0;

			const newWpm = totalCorrectChars / 5 / (totalTime / 60);
			setWpm(newWpm);
		},
		startTime !== null && !isGoalReached ? 1000 : null,
	);

	useInterval(
		() => {
			const totalTime = startTime
				? (new Date().getTime() - startTime.getTime()) / 1000
				: 0;
			setTotalTime(totalTime);
		},
		startTime !== null && !isGoalReached ? 75 : null,
	);

	const handleOnReset = (
		word: string,
		typeTime: number,
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => {
		if (currentDirection === 'up') {
			const newWord = getRandomUniqueWord([
				...moveDownWords,
				...moveLeftWords,
				...moveRightWords,
				moveUpWords[1],
			]);
			setMoveUpWords([moveUpWords[1], newWord]);
		} else if (currentDirection === 'down') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveLeftWords,
				...moveRightWords,
				moveDownWords[1],
			]);
			setMoveDownWords([moveDownWords[1], newWord]);
		} else if (currentDirection === 'left') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveRightWords,
				moveLeftWords[1],
			]);
			setMoveLeftWords([moveLeftWords[1], newWord]);
		} else if (currentDirection === 'right') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveLeftWords,
				moveRightWords[1],
			]);
			setMoveRightWords([moveRightWords[1], newWord]);
		}

		const newTotalCorrectChars = totalCorrectChars + correctChars;
		setTotalCorrectChars(newTotalCorrectChars);
		const newTotalIncorrectChars = totalIncorrectChars + incorrectChars;
		setTotalIncorrectChars(newTotalIncorrectChars);
		const totalTime = startTime
			? (endTime.getTime() - startTime.getTime()) / 1000
			: 0;

		const currentWpm = newTotalCorrectChars / 5 / (totalTime / 60);
		console.log(
			startTime,
			endTime,
			totalTime,
			currentWpm,
			newTotalCorrectChars,
		);
		setWpm(currentWpm);
		setCurrentDirection(null);
		setMoves((v) => v + 1);
	};

	const handleOnWordTyped = (typeTime: number) => {
		console.log('Finished in ', typeTime);
		if (currentDirection === 'up') {
			const newWord = getRandomUniqueWord([
				...moveDownWords,
				...moveLeftWords,
				...moveRightWords,
				moveUpWords[1],
			]);
			setMoveUpWords([moveUpWords[1], newWord]);
			onMove('up');
		} else if (currentDirection === 'down') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveLeftWords,
				...moveRightWords,
				moveDownWords[1],
			]);
			setMoveDownWords([moveDownWords[1], newWord]);
			onMove('down');
		} else if (currentDirection === 'left') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveRightWords,
				moveLeftWords[1],
			]);
			setMoveLeftWords([moveLeftWords[1], newWord]);
			onMove('left');
		} else if (currentDirection === 'right') {
			const newWord = getRandomUniqueWord([
				...moveUpWords,
				...moveDownWords,
				...moveLeftWords,
				moveRightWords[1],
			]);
			setMoveRightWords([moveRightWords[1], newWord]);
			onMove('right');
		}

		setCurrentDirection(null);
		setMoves((v) => v + 1);
	};

	const handleOnLetterTyped = (
		endTime: Date,
		correctChars: number,
		incorrectChars: number,
	) => {
		const newTotalCorrectChars = totalCorrectChars + correctChars;
		setTotalCorrectChars(newTotalCorrectChars);
		const newTotalIncorrectChars = totalIncorrectChars + incorrectChars;
		setTotalIncorrectChars(newTotalIncorrectChars);
		const totalTime = startTime
			? (endTime.getTime() - startTime.getTime()) / 1000
			: 0;

		const currentWpm =
			totalTime != 0 ? newTotalCorrectChars / 5 / (totalTime / 60) : 0;

		console.log(
			startTime,
			endTime,
			totalTime,
			currentWpm,
			newTotalCorrectChars,
		);
	};

	const handleCheckDirection = (
		direction: 'up' | 'down' | 'left' | 'right',
		isCorrect: boolean,
	) => {
		if (isCorrect) {
			console.log('Set new direction: ', direction);
			setCurrentDirection(direction);
		}
	};

	const handleClickNormal = () => {
		setIsTracking(false);
	};

	const handleClickTracking = () => {
		setIsTracking(true);
	};

	const handleResize = useCallback(() => {
		console.log(window.innerWidth, window.innerHeight);

		if (canvasContainer.current && canvasRef.current && ctx) {
			console.log(canvasRef.current.getBoundingClientRect().width);

			const width = canvasContainer.current.getBoundingClientRect().width;
			const height = canvasContainer.current.getBoundingClientRect().height;
			console.log(width, height);

			canvasRef.current.width = Math.floor(Math.min(width, height));
			canvasRef.current.height = Math.floor(Math.min(width, height));

			const { width: cellWidth } = mazeGenerator.updateSize(width, ctx);

			setWidth(cellWidth);
		}
	}, [ctx, mazeGenerator]);

	useEffect(() => {
		if (ctx) {
			handleResize();
			mazeGenerator.draw(ctx);
		}
	}, [ctx, handleResize, mazeGenerator]);

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

	const onMove = (direction: string) => {
		if (!ctx) {
			return;
		}

		console.log('move: ', direction);
		const playerPos = mazeGenerator.move(direction, () => {
			setIsGoalReached(true);
			const totalTime = startTime
				? (new Date().getTime() - startTime.getTime()) / 1000
				: 0;

			const newWpm = totalCorrectChars / 5 / (totalTime / 60);
			setWpm(newWpm);
		});
		mazeGenerator.draw(ctx);
		setPos(playerPos);
	};

	const handleOnRestart = () => {
		setIsGoalReached(false);
		onRestart();
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]);

	return (
		<div className="grid grid-cols-[8rem_1fr_8rem] grid-rows-[auto_auto_0.5fr_auto_auto] gap-6 items-center justify-items-center w-full h-full">
			<div className="col-start-2 flex flex-col gap-2 bg-zinc-800 rounded-xl px-4 py-3">
				<div className="flex justify-between gap-6 bg-zinc-700 rounded-xl px-4 py-3">
					<div className="flex flex-col justify-between items-center">
						<div>Chars</div>
						<div>
							<span title={`${totalCorrectChars} correct characters`}>
								{totalCorrectChars}
							</span>
							/
							<span title={`${totalIncorrectChars} incorrect characters`}>
								{totalIncorrectChars}
							</span>
						</div>
					</div>
					<div className="flex w-0.5 bg-zinc-600 rounded-full flex-shrink-0 my-2"></div>
					<div className="flex flex-col justify-between items-center">
						<div>Acc</div>
						<div title={`${Math.round(totalAccuracy * 100)}% accuracy`}>
							{Math.round(totalAccuracy * 100)}%
						</div>
					</div>
					<div className="flex w-0.5 bg-zinc-600 rounded-full flex-shrink-0 my-2"></div>
					<div className="flex flex-col justify-between items-center">
						<div>Moves</div>
						<div>{moves}</div>
					</div>
				</div>

				<div className="flex justify-center gap-6 bg-zinc-700 rounded-xl px-4 py-3">
					<div className="flex flex-col justify-between items-center">
						<div>Time</div>
						<div className="text-2xl" title={`${totalTime} Words Per Minute`}>
							{totalTime ? formatDuration(totalTime) : '0'}
						</div>
					</div>
				</div>

				<div className="flex justify-center gap-6 bg-zinc-700 rounded-xl px-4 py-3">
					<div className="flex flex-col justify-between items-center">
						<div className="text-lg">WPM</div>
						<div
							className="text-6xl"
							title={`${Math.round(wpm * 100) / 100} Words Per Minute`}
						>
							{Math.round(wpm)}
						</div>
					</div>
				</div>

				{!isGoalReached && (
					<div className="flex gap-2">
						<button
							onClick={handleClickNormal}
							className={`${
								isTracking ? 'bg-red-500' : 'bg-green-500'
							} p-1 rounded-md`}
						>
							Normal
						</button>
						<button
							onClick={handleClickTracking}
							className={`${
								isTracking ? 'bg-green-500' : 'bg-red-500'
							} p-1 rounded-md`}
						>
							Tracking
						</button>
					</div>
				)}
			</div>

			<div className="relative col-start-2 row-start-3 h-full aspect-square">
				{isTracking && !isGoalReached && (
					<div
						className="absolute grid grid-cols-3 grid-rows-3 transition-transform pointer-events-none text items-center"
						style={{
							transform: `translate(calc(-50% + ${
								width * pos.x
							}px),calc(-50% + ${width * pos.y}px))`,
							top: `${width / 2}px`,
							left: `${width / 2}px`,
							gridTemplateColumns: `minmax(0, 1fr) minmax(${width}px, 1fr) minmax(0, 1fr)`,
							gridTemplateRows: `minmax(0, 1fr) minmax(${width}px, 1fr) minmax(0, 1fr)`,
						}}
					>
						{/* style={{
					transform: `translate(${(width / 2) * pos.x}px,${
						(width / 2) * pos.y
					}px) translate(-50%,-50%)`,
				}} */}
						<div className="flex flex-col items-center col-start-2 self-end">
							{isDirectionLabelVisible && (
								<div
									className={`${
										currentDirection == 'up' ? 'text-red-500' : ''
									} transition-colors duration-75`}
								>
									Up
								</div>
							)}
							<TypingText
								key={'up' + moveUpWords[0]}
								words={moveUpWords}
								direction={'up'}
								currentDirection={currentDirection}
								onWordTyped={handleOnWordTyped}
								onLetterTyped={handleOnLetterTyped}
								onStart={handleOnStart}
								onReset={handleOnReset}
								onCheckDirection={handleCheckDirection}
							/>
						</div>
						<div className="flex flex-col items-center col-start-2 row-start-3 self-start">
							{isDirectionLabelVisible && (
								<div
									className={`${
										currentDirection == 'down' ? 'text-red-500' : ''
									} transition-colors duration-75`}
								>
									Down
								</div>
							)}
							<TypingText
								key={'down' + moveDownWords[0]}
								words={moveDownWords}
								direction={'down'}
								currentDirection={currentDirection}
								onWordTyped={handleOnWordTyped}
								onLetterTyped={handleOnLetterTyped}
								onStart={handleOnStart}
								onReset={handleOnReset}
								onCheckDirection={handleCheckDirection}
							/>
						</div>
						<div className="col-start-1 row-start-2 justify-self-end">
							{isDirectionLabelVisible && (
								<div
									className={`${
										currentDirection == 'left' ? 'text-red-500' : ''
									} text-end transition-colors duration-75`}
								>
									Left
								</div>
							)}
							<TypingText
								key={'left' + moveLeftWords[0]}
								words={moveLeftWords}
								direction={'left'}
								currentDirection={currentDirection}
								onWordTyped={handleOnWordTyped}
								onLetterTyped={handleOnLetterTyped}
								onStart={handleOnStart}
								onReset={handleOnReset}
								onCheckDirection={handleCheckDirection}
							/>
						</div>
						<div className="col-start-3 row-start-2 justify-self-start">
							{isDirectionLabelVisible && (
								<div
									className={`${
										currentDirection == 'right' ? 'text-red-500' : ''
									} transition-colors duration-75`}
								>
									Right
								</div>
							)}
							<TypingText
								key={'right' + moveRightWords[0]}
								words={moveRightWords}
								direction={'right'}
								currentDirection={currentDirection}
								onWordTyped={handleOnWordTyped}
								onLetterTyped={handleOnLetterTyped}
								onStart={handleOnStart}
								onReset={handleOnReset}
								onCheckDirection={handleCheckDirection}
							/>
						</div>
					</div>
				)}
				<div ref={canvasContainer} className="w-full h-full">
					<canvas ref={canvasRef}></canvas>
				</div>
			</div>
			{!isTracking && !isGoalReached && (
				<>
					<div className="flex flex-col items-center col-start-2 self-end">
						<div
							className={`${
								currentDirection == 'up' ? 'text-red-500' : ''
							} transition-colors duration-75`}
						>
							Up
						</div>
						<TypingText
							key={'up' + moveUpWords[0]}
							words={moveUpWords}
							direction={'up'}
							currentDirection={currentDirection}
							onWordTyped={handleOnWordTyped}
							onLetterTyped={handleOnLetterTyped}
							onStart={handleOnStart}
							onReset={handleOnReset}
							onCheckDirection={handleCheckDirection}
						/>
					</div>
					<div className="flex flex-col items-center col-start-2 row-start-4 self-start">
						<div
							className={`${
								currentDirection == 'down' ? 'text-red-500' : ''
							} transition-colors duration-75`}
						>
							Down
						</div>
						<TypingText
							key={'down' + moveDownWords[0]}
							words={moveDownWords}
							direction={'down'}
							currentDirection={currentDirection}
							onWordTyped={handleOnWordTyped}
							onLetterTyped={handleOnLetterTyped}
							onStart={handleOnStart}
							onReset={handleOnReset}
							onCheckDirection={handleCheckDirection}
						/>
					</div>
					<div className="col-start-1 row-start-3 justify-self-end">
						<div
							className={`${
								currentDirection == 'left' ? 'text-red-500' : ''
							} text-end transition-colors duration-75`}
						>
							Left
						</div>
						<TypingText
							key={'left' + moveLeftWords[0]}
							words={moveLeftWords}
							direction={'left'}
							currentDirection={currentDirection}
							onWordTyped={handleOnWordTyped}
							onLetterTyped={handleOnLetterTyped}
							onStart={handleOnStart}
							onReset={handleOnReset}
							onCheckDirection={handleCheckDirection}
						/>
					</div>
					<div className="col-start-3 row-start-3 justify-self-start">
						<div
							className={`${
								currentDirection == 'right' ? 'text-red-500' : ''
							} transition-colors duration-75`}
						>
							Right
						</div>
						<TypingText
							key={'right' + moveRightWords[0]}
							words={moveRightWords}
							direction={'right'}
							currentDirection={currentDirection}
							onWordTyped={handleOnWordTyped}
							onLetterTyped={handleOnLetterTyped}
							onStart={handleOnStart}
							onReset={handleOnReset}
							onCheckDirection={handleCheckDirection}
						/>
					</div>
				</>
			)}

			{isGoalReached && (
				<div className="col-start-2 row-start-5">
					<button
						className="m-4 p-2 bg-zinc-700 rounded-md"
						onClick={() => handleOnRestart()}
					>
						Restart
					</button>
				</div>
			)}
			{/* <div>Words</div>
			<div>{moveUpWords.join(' ')}</div>
			<div>{moveDownWords.join(' ')}</div>
			<div>{moveLeftWords.join(' ')}</div>
			<div>{moveRightWords.join(' ')}</div> */}
		</div>
	);
}

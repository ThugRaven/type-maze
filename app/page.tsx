'use client';

import Image from 'next/image';
import { ReactElement, useCallback, useEffect, useState } from 'react';

const text = 'The quick brown fox jumps over the lazy dog';
const regex = new RegExp('^[a-zA-Z0-9 &,._-]$');

export default function Home() {
	const [index, setIndex] = useState(0);
	const [errorsArray, setErrorsArray] = useState<boolean[]>(
		new Array(text.length).fill(false),
	);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [endTime, setEndTime] = useState<Date | null>(null);
	const [textWpm, setTextWpm] = useState(0);
	const [currentTime, setCurrentTime] = useState<Date | null>(null);
	const [correctChars, setCorrectChars] = useState(0);
	const [accuracy, setAccuracy] = useState(0);

	const incorrectChars = errorsArray.filter((value) => value).length;
	const totalTime =
		startTime && currentTime
			? (currentTime.getTime() - startTime.getTime()) / 1000
			: 0;
	const currentWpm = correctChars / 5 / (totalTime / 60);
	// console.log(currentTime?.getTime(), startTime?.getTime(), totalTime);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const { key } = e;
			console.log(key, e);

			if (key === 'Tab') {
				setIndex(0);
				setErrorsArray(new Array(text.length).fill(false));
				setStartTime(null);
				setEndTime(null);
				setTextWpm(0);
				setCurrentTime(null);
				setCorrectChars(0);
				setAccuracy(0);
				e.preventDefault();
				return;
			}

			if (!regex.test(key)) {
				return;
			}

			if (startTime == null) {
				setStartTime(new Date());
			}

			if (!errorsArray[index]) {
				if (key === text[index]) {
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

			if (key === text[index]) {
				setIndex((index) => index + 1);

				if (index + 1 === text.length) {
					setEndTime(new Date());
					const fullTime = startTime
						? (new Date().getTime() - startTime.getTime()) / 1000
						: 0;
					console.log('end', fullTime);

					setTextWpm((correctChars + 1) / 5 / (fullTime / 60));
					setAccuracy((correctChars + 1) / text.length);
				}
			}
		},
		[index, startTime, correctChars, errorsArray],
	);

	useEffect(() => {
		console.log('addEventListener');
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			console.log('removeEventListener');
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	useEffect(() => {
		if (!startTime) {
			return;
		}

		setInterval(() => {
			setCurrentTime(new Date());
		}, 100);
	}, [startTime]);

	const getStyledText = (
		startIndex: number,
		length: number,
		style: 'completed' | 'selected' | 'notcompleted',
	) => {
		let chars: string[] = [];
		const result: ReactElement[] = [];
		for (let i = startIndex; i < length; i++) {
			const char = text[i];
			if (errorsArray[i] && i != index) {
				if (chars.length > 0) {
					result.push(<span key={`chars-${i}`}>{chars.join('')}</span>);
					chars = [];
				}
				result.push(
					<span key={`errors-${i}`} className="text-red-500">
						{char === ' ' ? '•' : char}
					</span>,
				);
			} else {
				if (char === ' ') {
					result.push(<span key={`chars-${i}`}>{chars.join('')}</span>);
					chars = [];
					result.push(
						<span
							key={`space-${i}`}
							className={`${
								style === 'completed'
									? 'text-gray-700'
									: style === 'selected'
									? 'text-white'
									: 'text-gray-700'
							}`}
						>
							•
						</span>,
					);
				} else {
					chars.push(char);
				}
			}
		}
		if (chars.length > 0) {
			result.push(<span key={`chars-${length}`}>{chars.join('')}</span>);
		}

		return result;
	};

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
					<div>Correct chars: {correctChars}</div>
					<div>Incorrect chars: {incorrectChars}</div>
					<div>Current wpm: {Math.round(currentWpm)}</div>
					<div>Wpm: {Math.round(textWpm)}</div>
					<div>Acc: {accuracy > 0 ? Math.round(accuracy * 100) : '-'}%</div>
					<div>
						{startTime &&
							endTime &&
							(endTime.getTime() - startTime.getTime()) / 1000}
					</div>
					<div>{totalTime}</div>
					<span className="text-gray-700">
						{getStyledText(0, index, 'completed')}
					</span>
					<span className="relative before:absolute before:-bottom-px before:w-full before:bg-white before:h-px">
						{getStyledText(index, index + 1, 'selected')}
					</span>
					<span>{getStyledText(index + 1, text.length, 'notcompleted')}</span>
				</div>
				<Image
					className="dark:invert"
					src="https://nextjs.org/icons/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
				<ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
					<li className="mb-2">
						Get started by editing{' '}
						<code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
							app/page.tsx
						</code>
						.
					</li>
					<li>Save and see your changes instantly.</li>
				</ol>

				<div className="flex gap-4 items-center flex-col sm:flex-row">
					<a
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							className="dark:invert"
							src="https://nextjs.org/icons/vercel.svg"
							alt="Vercel logomark"
							width={20}
							height={20}
						/>
						Deploy now
					</a>
					<a
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Read our docs
					</a>
				</div>
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="https://nextjs.org/icons/file.svg"
						alt="File icon"
						width={16}
						height={16}
					/>
					Learn
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="https://nextjs.org/icons/window.svg"
						alt="Window icon"
						width={16}
						height={16}
					/>
					Examples
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="https://nextjs.org/icons/globe.svg"
						alt="Globe icon"
						width={16}
						height={16}
					/>
					Go to nextjs.org →
				</a>
			</footer>
		</div>
	);
}

import { ReactElement } from 'react';

export const TypedText = ({
	text,
	index,
	errorsArray,
	customText,
}: {
	text: string;
	index: number;
	errorsArray: boolean[];
	customText?: string;
}) => {
	const getStyledText = (
		text: string,
		startIndex: number,
		length: number,
		style: 'completed' | 'selected' | 'notcompleted',
		skipErrors = false,
	) => {
		let chars: string[] = [];
		const result: ReactElement[] = [];
		for (let i = startIndex; i < length; i++) {
			const char = text[i];
			if (errorsArray[i] && i != index && !skipErrors) {
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
		<div>
			<span className="text-gray-600">
				{getStyledText(text, 0, index, 'completed')}
			</span>
			<span className="relative before:absolute before:-bottom-px before:w-full before:bg-white before:h-px">
				{getStyledText(text, index, index + 1, 'selected')}
			</span>
			<span>{getStyledText(text, index + 1, text.length, 'notcompleted')}</span>
			{customText && (
				<span>
					{getStyledText(
						customText,
						0,
						customText.length,
						'notcompleted',
						true,
					)}
				</span>
			)}
		</div>
	);
};

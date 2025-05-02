import seedrandom from 'seedrandom';

export const random = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};

export const seededRandom = (
	min: number,
	max: number,
	rng: seedrandom.PRNG,
) => {
	return rng() * (max - min) + min;
};

export const randomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const seededRandomInt = (
	min: number,
	max: number,
	rng: seedrandom.PRNG,
) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(rng() * (max - min + 1) + min);
};

export const getDailySeed = () => {
	const date = new Date();
	return `${date.getUTCDate()}${
		date.getUTCMonth() + 1
	}${date.getUTCFullYear()}`;
};

export const formatDuration = (duration: number) => {
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;

	return `${
		duration < 60
			? `${duration.toFixed(2)}s`
			: `${minutes < 10 ? '0' : ''}${minutes}:${
					seconds < 10 ? '0' : ''
			  }${Math.floor(seconds)}`
	}`;
};

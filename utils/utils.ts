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

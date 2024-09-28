import { randomInt } from '@/utils/utils';

export default class MazeGenerator {
	cols: number;
	rows: number;
	grid: Cell[];
	current: Cell;
	stack: Cell[];

	constructor() {
		this.cols = 10;
		this.rows = 10;
		this.grid = [];
		this.stack = [];

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const cell = new Cell(this.grid, this.cols, this.rows, x, y);
				this.grid.push(cell);
			}
		}

		this.current = this.grid[0];

		console.log(this.grid);
	}

	draw() {
		const list = [];

		this.current.visited = true;

		while (this.current.checkNeighbors() || this.stack.length > 0) {
			const next = this.current.checkNeighbors();
			if (next) {
				next.visited = true;
				this.stack.push(this.current);
				this.current.removeWalls(next);
				this.current = next;
			} else {
				const cell = this.stack.pop();
				if (cell) {
					this.current = cell;
				}
			}
		}

		for (let i = 0; i < this.grid.length; i++) {
			list.push(this.grid[i].drawCell());
		}

		return list;
	}
}

class Cell {
	grid: Cell[];
	cols: number;
	rows: number;
	x: number;
	y: number;
	// top, right, bottom, left
	walls: [boolean, boolean, boolean, boolean];
	visited: boolean;

	constructor(grid: Cell[], cols: number, rows: number, x: number, y: number) {
		this.grid = grid;
		this.cols = cols;
		this.rows = rows;
		this.x = x;
		this.y = y;
		this.walls = [true, true, true, true];
		this.visited = false;
	}

	index(x: number, y: number) {
		if (x < 0 || y < 0 || x > this.cols - 1 || y > this.rows - 1) {
			return -1;
		}

		return x + y * this.cols;
	}

	checkNeighbors() {
		const neighbors = [];

		const top = this.grid[this.index(this.x, this.y - 1)];
		const right = this.grid[this.index(this.x + 1, this.y)];
		const bottom = this.grid[this.index(this.x, this.y + 1)];
		const left = this.grid[this.index(this.x - 1, this.y)];

		if (top && !top.visited) {
			neighbors.push(top);
		}
		if (right && !right.visited) {
			neighbors.push(right);
		}
		if (bottom && !bottom.visited) {
			neighbors.push(bottom);
		}
		if (left && !left.visited) {
			neighbors.push(left);
		}

		if (neighbors.length > 0) {
			const r = randomInt(0, neighbors.length - 1);
			return neighbors[r];
		} else return null;
	}

	drawCell() {
		const borders = [];

		if (this.walls[0]) {
			borders.push('border-t');
		}
		if (this.walls[1]) {
			borders.push('border-r');
		}
		if (this.walls[2]) {
			borders.push('border-b');
		}
		if (this.walls[3]) {
			borders.push('border-l');
		}

		return (
			<div
				className={`w-4 h-4 ${borders.join(' ')} ${
					this.visited ? 'bg-lime-500' : 'bg-gray-500'
				}`}
			></div>
		);
	}

	removeWalls(next: Cell) {
		const x = this.x - next.x;
		if (x === 1) {
			this.walls[3] = false;
			next.walls[1] = false;
		} else if (x === -1) {
			this.walls[1] = false;
			next.walls[3] = false;
		}

		const y = this.y - next.y;
		if (y === 1) {
			this.walls[0] = false;
			next.walls[2] = false;
		} else if (y === -1) {
			this.walls[2] = false;
			next.walls[0] = false;
		}
	}
}

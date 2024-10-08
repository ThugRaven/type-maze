import { line, rect } from '@/utils/shapes';
import { randomInt } from '@/utils/utils';

export default class MazeGenerator {
	cols: number;
	rows: number;
	width: number;
	grid: Cell[];
	current: Cell;
	stack: Cell[];
	player: Cell;
	goal: Cell;

	constructor() {
		this.cols = 10;
		this.rows = 10;
		this.width = 40;
		this.grid = [];
		this.stack = [];

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const cell = new Cell(
					this.grid,
					this.cols,
					this.rows,
					this.width,
					x,
					y,
				);
				this.grid.push(cell);
			}
		}

		this.current = this.grid[0];
		this.player = this.grid[0];
		this.goal = this.grid[this.grid.length - 1];
		this.grid[0].playerVisited = true;

		console.log(this.grid);
	}

	updateSize(width: number, ctx: CanvasRenderingContext2D) {
		console.log(this.width);
		// ctx.clearRect(0, 0, this.cols * this.width, this.rows * this.width);
		this.width = Math.floor(Math.floor(width) / this.cols);
		this.draw(ctx);
		console.log(this.width, this.cols, this.rows);
	}

	move(direction: string, onGoalReached: () => void) {
		if (direction === 'up' && !this.player.walls[0]) {
			this.grid[
				this.player.index(this.player.x, this.player.y - 1)
			].playerVisited = true;
			this.player =
				this.grid[this.player.index(this.player.x, this.player.y - 1)];

			console.log(direction);
		}
		if (direction === 'right' && !this.player.walls[1]) {
			this.grid[
				this.player.index(this.player.x + 1, this.player.y)
			].playerVisited = true;
			this.player =
				this.grid[this.player.index(this.player.x + 1, this.player.y)];
			console.log(direction);
		}
		if (direction === 'down' && !this.player.walls[2]) {
			this.grid[
				this.player.index(this.player.x, this.player.y + 1)
			].playerVisited = true;
			this.player =
				this.grid[this.player.index(this.player.x, this.player.y + 1)];
			console.log(direction);
		}
		if (direction === 'left' && !this.player.walls[3]) {
			this.grid[
				this.player.index(this.player.x - 1, this.player.y)
			].playerVisited = true;
			this.player =
				this.grid[this.player.index(this.player.x - 1, this.player.y)];
			console.log(direction);
		}

		if (this.player === this.goal) {
			console.log('goal reached');
			onGoalReached();
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, this.cols * this.width, this.rows * this.width);
		ctx.strokeStyle = 'white';
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
			if (this.grid[i] === this.player) {
				this.grid[i].drawCell(true, false, ctx, this.width);
			} else if (this.grid[i] === this.goal) {
				this.grid[i].drawCell(false, true, ctx, this.width);
			} else {
				this.grid[i].drawCell(false, false, ctx, this.width);
			}
		}
	}
}

class Cell {
	grid: Cell[];
	cols: number;
	rows: number;
	width: number;
	x: number;
	y: number;
	// top, right, bottom, left
	walls: [boolean, boolean, boolean, boolean];
	visited: boolean;
	playerVisited: boolean;

	constructor(
		grid: Cell[],
		cols: number,
		rows: number,
		width: number,
		x: number,
		y: number,
	) {
		this.grid = grid;
		this.cols = cols;
		this.rows = rows;
		this.width = width;
		this.x = x;
		this.y = y;
		this.walls = [true, true, true, true];
		this.visited = false;
		this.playerVisited = false;
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

	drawCell(
		player: boolean,
		goal: boolean,
		ctx: CanvasRenderingContext2D,
		width: number,
	) {
		const _x = this.x * width;
		const _y = this.y * width;
		console.log(width);

		if (this.playerVisited) {
			ctx.fillStyle = 'rgb(0,26,0)';
			rect(ctx, _x, _y, width, width);
		}

		if (player) {
			ctx.fillStyle = 'lime';
			rect(ctx, _x, _y, width, width);
		}

		if (goal) {
			ctx.fillStyle = 'red';
			rect(ctx, _x, _y, width, width);
		}

		if (this.walls[0]) {
			line(ctx, _x, _y, _x + width, _y);
		}
		if (this.walls[1]) {
			line(ctx, _x + width, _y, _x + width, _y + width);
		}
		if (this.walls[2]) {
			line(ctx, _x + width, _y + width, _x, _y + width);
		}
		if (this.walls[3]) {
			line(ctx, _x, _y + width, _x, _y);
		}
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

import { v4 as uuidv4 } from 'uuid';
import Bin, { binState } from '@_model/Bin';

class ShelfError {
	#msg;

	constructor(message="") {
		this.#msg = message;
	}

	get msg() {
		return this.#msg;
	}
}

class Shelf {
	#name;
	#id;
	#binSize;
	#width;
	#height;
	#position;
	#isFlipped;
	#bins;
	
	constructor(name, binSize, width, height, 
				position = {x: binSize*width/2, y: binSize*height/2, z: binSize/2}, 
				isFlipped = false, id='s_'+uuidv4()) {
		this.#name = name;
		this.#id = id;
		this.#binSize = binSize;
		this.#width = width;
		this.#height = height;
		this.#position = position;
		this.#isFlipped = isFlipped;
		this.#bins = this.#createEmpty();
	}

	#createEmpty(){
		const matrix = [];
		for (let i = 0; i < this.#height; i++) {
			const row = [];
			for (let j = 0; j < this.#width; j++) {
				row.push(new Bin(`${this.id}+${i}+${j}`));		
			}
			matrix.push(row);
		}
		return matrix;
	}

	#isColumnEmpty(index) {
		let isEmpty = true;
		for (let i = 0; i < this.#height; i++) {
			if(this.#bins[i][index].state !== binState.EMPTY) {
				isEmpty = false;
				break;
			}	
		}
		return isEmpty;
	}

	#isRowEmpty(index) {
		let isEmpty = true;
		for (let i = 0; i < this.#width; i++) {
			if(this.#bins[index][i].state !== binState.EMPTY){
				isEmpty = false;
				break;
			}
		}
		return isEmpty;
	}

	#addCols(value) {
		for (let index = 0; index < this.#height; index++) {
			for(let j = 0; j < value; j++) {
				this.#bins[index][this.#width + j] = new Bin(`${this.id}+${index}+${this.#width + j}`);
			}			
		}
	}

	#removeCols(value) {
		for(let j = 0; j < value; j++) {
			if(!this.#isColumnEmpty(this.#width - (j + 1))) throw new ShelfError("Cannot delete non-empty bins");
		}
		for (let index = 0; index < this.#height; index++) {
			for(let j = 0; j < value; j++) {
				this.#bins[index].pop();
			}			
		}
	}

	#addRows(value) {
		for (let index = 0; index < value; index++) {
			const row = [];
			for (let j = 0; j < this.#width; j++) {
				row.push(new Bin(`${this.id}+${this.#height + index}+${this.#width + j}`));		
			}
			this.#bins.push(row);	
		}
	}

	#removeRows(value) {
		for(let j = 1; j <= value; j++) {
			if(!this.#isRowEmpty(this.#height - j)) throw new ShelfError("Cannot delete non-empty bins");
		}
		for(let j = 1; j <= value; j++) {
			this.#bins.pop();
		}
	}

	get position() {
		return this.#position;
	}

	set position(value) {
		this.#position = value;
	}

	get name() {
		return this.#name;
	}

	set name(value) {
		this.#name = value;
	}

	get id() {
		return this.#id;
	}

	get width() {
		return this.#width;
	}

	set width(value) {
		if(value > this.#width) this.#addCols(value - this.#width);
		else this.#removeCols(this.#width - value);
		this.#width = value;
	}

	get height() {
		return this.#height;
	}

	set height(value) {
		if(value > this.#height) this.#addRows(value - this.#height);
		else this.#removeRows(this.#height - value);
		this.#height = value;
	}

	get isFlipped() {
		return this.#isFlipped;
	}

	set isFlipped(value) {
		this.#isFlipped = value;
	}

	get binSize() {
		return this.#binSize;
	}

	set binSize(value) {
		this.#binSize = value;
	}

	get bins() {
		return this.#bins;
	}

	set bins(shelf) {
		if(shelf.width === this.#width && shelf.height === this.#height) {
			for (let i = 0; i < this.#height; i++) {
				for (let j = 0; j < this.#width; j++) {
					this.#bins[i][j].productId = shelf.bins[i][j].productId;
					this.#bins[i][j].state = shelf.bins[i][j].state;	
				}
			}
		} else throw new ShelfError("Set bin of shelf has mismatched dimensions");
	}
}

export { ShelfError };
export default Shelf;
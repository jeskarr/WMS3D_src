import { v4 as uuidv4 } from 'uuid';

class Product {
	#name;
	#id;
	#color;

	constructor(name, color = {r: 138, g: 102, b: 66}, id='p_'+uuidv4()) {
		this.#name = name;
		this.#id = id;
		this.#color = color;
	}

	get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    set name(newName) {
        this.#name = newName;
    }

    get color() {
        return this.#color;
    }

    set color(newColor) {
        this.#color = newColor;
    }
}

export default Product;
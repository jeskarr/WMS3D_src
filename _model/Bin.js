const binState = {
	EMPTY: 'EMPTY',
	OUTGOING: 'OUTGOING',
	INCOMING: 'INCOMING',
	STILL: 'STILL',
}

class Bin {
	#id;
	#productId;
	#state;

	constructor(id, productId=null, state = binState.EMPTY) {
		this.#id = id;
		this.#productId = productId;
		this.#state = state;
	}

	get id() {
        return this.#id;
    }

    get productId() {
        return this.#productId;
    }

    set productId(newProductId) {
        this.#productId = newProductId;
    }

    get state() {
        return this.#state;
    }

    set state(newState) {
        this.#state = newState;
    }
}

export { binState };
export default Bin;
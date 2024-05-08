import { v4 as uuidv4 } from 'uuid';

class Movement {
    #id;
    #fromId;
    #fromRow;
    #fromCol;
    #toId;
    #toRow;
    #toCol;

    constructor(fromId, fromRow, fromCol, toId, toRow, toCol, id='m_'+uuidv4()) {
        this.#id = id;
        this.#fromId = fromId;
        this.#fromRow = fromRow;
        this.#fromCol = fromCol;
        this.#toId = toId;
        this.#toRow = toRow;
        this.#toCol = toCol;
    }

    get id() {
        return this.#id;
    }

    get fromId() {
        return this.#fromId;
    }

    set fromId(value) {
        this.#fromId = value;
    }

    get fromRow() {
        return this.#fromRow;
    }

    set fromRow(value) {
        this.#fromRow = value;
    }

    get fromCol() {
        return this.#fromCol;
    }

    set fromCol(value) {
        this.#fromCol = value;
    }

    get toId() {
        return this.#toId;
    }

    set toId(value) {
        this.#toId = value;
    }

    get toRow() {
        return this.#toRow;
    }

    set toRow(value) {
        this.#toRow = value;
    }

    get toCol() {
        return this.#toCol;
    }

    set toCol(value) {
        this.#toCol = value;
    }
}

export default Movement;
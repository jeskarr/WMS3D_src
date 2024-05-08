import Shelf from "@_model/Shelf";
import { render } from "../../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
import { binState } from "@_model/Bin";

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('shelvesSlice should set shelves correctly', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(shelves).toEqual(myShelves);
});

test('shelvesSlice should NOT set shelves if there are duplicate ids', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "firstShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(shelves.length).toEqual(0);
});

test('shelvesSlice should set error in set shelves if there are duplicate ids', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "myNewID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "myNewID"));

    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setShelves: state.setShelves
    });

	let firstRender = true;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(errorMsg).not.toEqual(null);
});

test('shelvesSlice should NOT set shelves if there are duplicate names', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("BlueShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("BlueShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "firstShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(shelves.length).toEqual(0);
});

test('shelvesSlice should set error in set shelves if there are duplicate ids', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("BlueShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "myNewID"));
    myShelves.push(new Shelf("BlueShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "myNewID"));

    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setShelves: state.setShelves
    });

	let firstRender = true;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(errorMsg).not.toEqual(null);
});

test('shelvesSlice should add new shelf correctly', () => {
    const selector = (state) => ({
        shelves: state.shelves,
        addShelf: state.addShelf,
        setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setWhsRectangle(50, 20, 32);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.addShelf("myShelf", 8, 2, 3);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfFound = false;
    for (let index = 0; index < shelves.length; index++) {
        if(
            shelves[index].name === "myShelf" && 
            shelves[index].binSize === 8 &&
            shelves[index].height === 2 &&
            shelves[index].width === 3
        ){
            shelfFound = true;
            break;
        }
    }

	expect(shelfFound).toEqual(true);
});

test('shelvesSlice should NOT add new shelf if height is > than whsHeight', () => {
    const selector = (state) => ({
        shelves: state.shelves,
        addShelf: state.addShelf,
        setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setWhsRectangle(50, 20, 32);
            firstRender = false;
            secondRender = true;
        }
        else if(secondRender) {
            items.addShelf("myShelf", 8, 5, 2);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfFound = false;
    for (let index = 0; index < shelves.length; index++) {
        if(
            shelves[index].name === "myShelf" && 
            shelves[index].binSize === 8 &&
            shelves[index].height === 5 &&
            shelves[index].width === 2
        ){
            shelfFound = true;
            break;
        }
    }

	expect(shelfFound).toEqual(false);
});

test('shelvesSlice should set error in add new shelf if height is > than whsHeight', () => {
    const selector = (state) => ({
        errorMsg: state.errorMsg,
        addShelf: state.addShelf,
        setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
    let secondRender = false;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setWhsRectangle(50, 20, 32);
            firstRender = false;
            secondRender = true;
        }
        else if(secondRender) {
            items.addShelf("myShelf", 8, 5, 2);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(errorMsg).not.toEqual(null);
});

test('shelvesSlice should NOT add new shelf if name already exists', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        addShelf: state.addShelf
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        }
        else if(secondRender) {
            items.addShelf("secondShelf", 4, 3, 8);
            secondRender = false;
        } 
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(shelves.length).toEqual(2);
});

test('shelvesSlice should set error in add new shelf if name already exists', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setShelves: state.setShelves,
        addShelf: state.addShelf
    });

	let firstRender = true;
    let secondRender = false;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        }
        else if(secondRender) {
            items.addShelf("secondShelf", 4, 3, 8);
            secondRender = false;
        } 
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(errorMsg).not.toEqual(null);
});

test('shelvesSlice should insert product correctly in EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.insertProduct("myProdId", "secondShelfID", 3, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[3][1].productId).toEqual("myProdId");
});

test('shelvesSlice should set state to STILL when inserting product in EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.insertProduct("myProdId", "secondShelfID", 3, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[3][1].state).toEqual(binState.STILL);
});

test('shelvesSlice should NOT insert product in non-EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[0][0].state = binState.STILL;
    myShelves[0].bins[0][0].productId = "someOtherProduct";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.insertProduct("myProdId", "firstShelfID", 0, 0);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[0][0].productId).toEqual("someOtherProduct");
});

test('shelvesSlice should change bin state when product is inserted', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 2, 6, 2, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 1, 7, 5, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.insertProduct("myProdId", "firstShelfID", 1, 4);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[1][4].state).toEqual(binState.STILL);
});

test('shelvesSlice should remove shelf correctly', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeShelf: state.removeShelf
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.removeShelf("firstShelfID");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfFound = false;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfFound = true;
            break;
        }        
    }

	expect(shelfFound).toEqual(false);
});

test('shelvesSlice should remove shelf only with EMPTY bins', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[0][0].state = binState.STILL;
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeShelf: state.removeShelf
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.removeShelf("firstShelfID");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfFound = false;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfFound = true;
            break;
        }        
    }

	expect(shelfFound).toEqual(true);
});

test('shelvesSlice should update shelf name', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 45);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("firstShelfID", "NewFirstShelf", 4, 3, 8);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.name).toEqual("NewFirstShelf");
});

test('shelvesSlice should NOT update shelf name if it already exists', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 45);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("secondShelfID", "firstShelf", 4, 3, 8);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.name).not.toEqual("firstShelf");
});

test('shelvesSlice should set error in update shelf name if it already exists', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 45);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("secondShelfID", "firstShelf", 4, 3, 8);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(errorMsg).not.toEqual(null);
});

test('shelvesSlice should update shelf binSize', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 50);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("firstShelfID", "firstShelf", 6, 3, 8);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.binSize).toEqual(6);
});

test('shelvesSlice should update shelf width', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 50);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("secondShelfID", "secondShelf", 3, 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.width).toEqual(7);
});

test('shelvesSlice should update shelf height', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 50);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("firstShelfID", "firstShelf", 2, 2, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.height).toEqual(1);
});

test('shelvesSlice should NOT update shelf height if higher than warehouse', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 50);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("firstShelfID", "firstShelf", 4, 3, 13);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.height).toEqual(8);
});

test('shelvesSlice should set error in update shelf height if higher than warehouse', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let msg = null;
	effect = jest.fn((items) => {
        msg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 50);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("firstShelfID", "firstShelf", 4, 3, 13);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(msg).not.toEqual(null);
});

test('shelvesSlice should set error in update (reduce) shelf height if bins are not empty', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[2][2].state = binState.STILL;
    myShelves[0].bins[2][2].productId = 'myProdID';
    
    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let msg = null;
	effect = jest.fn((items) => {
        msg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 50);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("firstShelfID", "firstShelf", 4, 3, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(msg).not.toEqual(null);
});

test('shelvesSlice should set error in update (reduce) shelf width if bins are not empty', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[2][2].state = binState.STILL;
    myShelves[0].bins[2][2].productId = 'myProdID';
    
    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setWhsRectangle: state.setWhsRectangle,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let msg = null;
	effect = jest.fn((items) => {
        msg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(80, 21, 50);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfInfo("firstShelfID", "firstShelf", 4, 1, 8);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(msg).not.toEqual(null);
});

test('shelvesSlice should update shelf position', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 8, 3, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition,
        setWhsRectangle: state.setWhsRectangle
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(40, 40, 20);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfPosition("firstShelfID", 10, 18);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(JSON.stringify(updatedShelf.position)).toEqual(JSON.stringify({x: 10, y: 5, z: 18}));
});

test('shelvesSlice should NOT update shelf position if shelf outside whs', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 8, 3, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition,
        setWhsRectangle: state.setWhsRectangle
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(40, 40, 20)
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfPosition("firstShelfID", 100, 18);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(JSON.stringify(updatedShelf.position)).not.toEqual(JSON.stringify({x: 100, y: 5, z: 18}));
});

test('shelvesSlice should set error in update shelf position if shelf outside whs', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition,
        setWhsRectangle: state.setWhsRectangle
    });

    let firstRender = true;
    let secondRender = false;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(40, 40, 20);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfPosition("firstShelfID", 100, 18);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(errorMsg).not.toEqual(null);
});

test('shelvesSlice should NOT update shelf position if there is an intersection involving the moving shelf', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    let intersectings = ["firstShelfID", "secondShelfID"];
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition,
        setWhsRectangle: state.setWhsRectangle,
        setIntersectingIds: state.setIntersectingIds
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(40, 40, 20);
            items.setIntersectingIds(intersectings);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfPosition("firstShelfID", 10, 18);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(JSON.stringify(updatedShelf.position)).not.toEqual(JSON.stringify({x: 10, y: 5, z: 18}));
});

test('shelvesSlice should set error in update shelf position if there is an intersection involving the moving shelf', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    let intersectings = ["firstShelfID", "secondShelfID"];
    
    const selector = (state) => ({
        errorMsg: state.errorMsg,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition,
        setWhsRectangle: state.setWhsRectangle,
        setIntersectingIds: state.setIntersectingIds
    });

    let firstRender = true;
    let secondRender = false;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            items.setWhsRectangle(40, 40, 20);
            items.setIntersectingIds(intersectings);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateShelfPosition("firstShelfID", 10, 18);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(errorMsg).not.toEqual(null);
});

test('shelvesSlice should update shelf isFlipped', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        flipShelf: state.flipShelf
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.flipShelf("firstShelfID");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.isFlipped).toEqual(false);
});

test('shelvesSlice should update bin state', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateBinState: state.updateBinState
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.updateBinState("secondShelfID", 8, 0, binState.OUTGOING);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedBin = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            updatedBin = shelves[index].bins[8][0];
            break;
        }        
    }

	expect(updatedBin.state).toEqual(binState.OUTGOING);
});

test('shelvesSlice should remove product correctly', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = binState.STILL;
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.removeProductFromBin("secondShelfID", 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[7][1].productId).toEqual(null);
});

test('shelvesSlice should empty bin when removing product', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = binState.STILL;
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.removeProductFromBin("secondShelfID", 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[7][1].state).toEqual(binState.EMPTY);
});
/*
test('shelvesSlice should set error when removing product from EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin,
        errorMsg: state.errorMsg
    });

	let firstRender = true;
    let secondRender = false;
	let error = null;
	effect = jest.fn((items) => {
        error = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.removeProductFromBin("secondShelfID", 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    expect(error).not.toEqual(null);
})*/
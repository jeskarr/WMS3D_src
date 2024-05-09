import Shelf from "@_model/Shelf";
import { render } from "../../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
// mocks
jest.mock('../../_lib/fileManagementSlice.js', () => {
	return {
		fileManagementSlice: (set, get) => ({ })
	}
});
jest.mock('../../_lib/productsSlice.js', () => {
	return {
		productsSlice: (set, get) => ({ })
	}
});

// whsSlice MOCK
jest.mock('../../_lib/whsSlice.js', () => {
	return {
		whsSlice: (set, get) => ({
            points: [
                {x: 10, z: 25},
                {x: -10, z: 25},
                {x: -10, z: -25},
                {x: 10, z: -25}
            ],
            whsHeight: 32
        })
	}
});

// interactionsSlice MOCK
jest.mock('../../_lib/interactionsSlice.js', () => {
	return {
		interactionsSlice: (set, get) => ({
            intersectingIds: ["intersectOneId", "intersectTwoId"],
            removeMovementsWithBin: jest.fn()
        })
	}
});

// errorSlice MOCK
const setError = jest.fn();
jest.mock('../../_lib/errorSlice.js', () => {
	return {
		errorSlice: (set, get) => ({
			errorMsg: null,
			setError: () => {setError()}
		})
	}
});
//

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

test('shelvesSlice should NOT set shelves if there are duplicate ids, it should set error', () => { 
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
    expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should NOT set shelves if there are duplicate names, it should set error', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("BlueShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("BlueShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

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
    expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should add new shelf correctly', () => {
    const selector = (state) => ({
        shelves: state.shelves,
        addShelf: state.addShelf
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.addShelf("myShelf", 8, 2, 3);
            firstRender = false;
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

test('shelvesSlice should NOT add new shelf if height is > than whsHeight, it should set error', () => {
    const selector = (state) => ({
        shelves: state.shelves,
        addShelf: state.addShelf
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.addShelf("myShelf", 8, 5, 2);
            firstRender = false;
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
    expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should NOT add new shelf if name already exists, it should set error', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        addShelf: state.addShelf
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.addShelf("secondShelf", 4, 3, 8);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(shelves.length).toEqual(2);
    expect(setError).toHaveBeenCalled();
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
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.insertProduct("myProdId", "secondShelfID", 3, 1);
            firstRender = false;
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
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.insertProduct("myProdId", "secondShelfID", 3, 1);
            firstRender = false;
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

    expect(shelfWithProduct.bins[3][1].state).toEqual("STILL");
});

test('shelvesSlice should NOT insert product in non-EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[0][0].state = "STILL";
    myShelves[0].bins[0][0].productId = "someOtherProduct";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.insertProduct("myProdId", "firstShelfID", 0, 0);
            firstRender = false;
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
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.insertProduct("myProdId", "firstShelfID", 1, 4);
            firstRender = false;
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

    expect(shelfWithProduct.bins[1][4].state).toEqual("STILL");
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
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.removeShelf("firstShelfID");
            firstRender = false;
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
    myShelves[0].bins[0][0].state = "STILL";
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeShelf: state.removeShelf
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.removeShelf("firstShelfID");
            firstRender = false;
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
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("firstShelfID", "NewFirstShelf", 4, 3, 8);
            firstRender = false;
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

test('shelvesSlice should NOT update shelf name if it already exists, it should set error', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("secondShelfID", "firstShelf", 4, 3, 8);
            firstRender = false;
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
    expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should update shelf binSize', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("firstShelfID", "firstShelf", 3, 3, 8);
            firstRender = false;
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
    
	expect(updatedShelf.binSize).toEqual(3);
});

test('shelvesSlice should update shelf width', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("secondShelfID", "secondShelf", 3, 7, 1);
            firstRender = false;
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
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("firstShelfID", "firstShelf", 2, 2, 1);
            firstRender = false;
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

test('shelvesSlice should NOT update shelf height if higher than warehouse, it should set error', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("firstShelfID", "firstShelf", 4, 3, 13);
            firstRender = false;
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
    expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should set error in update (reduce) shelf height if bins are not empty', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[2][2].state = "STILL";
    myShelves[0].bins[2][2].productId = 'myProdID';
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	effect = jest.fn((items) => {
        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("firstShelfID", "firstShelf", 4, 3, 1);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should set error in update (reduce) shelf width if bins are not empty', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[2][2].state = "STILL";
    myShelves[0].bins[2][2].productId = 'myProdID';
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
	effect = jest.fn((items) => {
        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfInfo("firstShelfID", "firstShelf", 4, 1, 8);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should update shelf position', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 2, 3, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfPosition("firstShelfID", 6, 9);
            firstRender = false;
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

	expect(JSON.stringify(updatedShelf.position)).toEqual(JSON.stringify({x: 6, y: 5, z: 9}));
});

test('shelvesSlice should NOT update shelf position if shelf outside whs, it should set error', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 2, 3, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfPosition("firstShelfID", 100, 18);
            firstRender = false;
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
    expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should NOT update shelf position if there is an intersection involving the moving shelf, it should set error', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 2, 6, {x: 4, y: 5, z: 7}, true, "intersectOneId"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 4, {x: 4, y: 20, z: 10}, false, "intersectTwoId"));
    let intersectings = ["firstShelfID", "secondShelfID"];
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateShelfPosition("intersectOneId", 6, 9);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "intersectOneId") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(JSON.stringify(updatedShelf.position)).not.toEqual(JSON.stringify({x: 6, y: 5, z: 9}));
    expect(setError).toHaveBeenCalled();
});

test('shelvesSlice should update shelf isFlipped', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 2, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 1, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        flipShelf: state.flipShelf
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.flipShelf("firstShelfID");
            firstRender = false;
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
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateBinState: state.updateBinState
    });

    let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.updateBinState("secondShelfID", 8, 0, "OUTGOING");
            firstRender = false;
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

	expect(updatedBin.state).toEqual("OUTGOING");
});

test('shelvesSlice should remove product correctly', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = "STILL";
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.removeProductFromBin("secondShelfID", 7, 1);
            firstRender = false;
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
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = "STILL";
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            items.removeProductFromBin("secondShelfID", 7, 1);
            firstRender = false;
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

    expect(shelfWithProduct.bins[7][1].state).toEqual("EMPTY");
});

test('shelvesSlice should return bins with specific product', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = "STILL";
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        setShelves: state.setShelves,
        getBinsWithProduct: state.getBinsWithProduct
    });

    let firstRender = true;
	let bins = null;
	effect = jest.fn((items) => {
        if(firstRender) {
            items.setShelves(myShelves);
            bins = items.getBinsWithProduct("myProductId");
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    expect(bins.length).toEqual(1);
    expect(bins[0].binId).toEqual("secondShelfID+7+1");
})
/*
test('shelvesSlice should set error when removing product from EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 1, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 2, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin
    });

	let firstRender = true;
	effect = jest.fn((items) => {
        if(firstRender) {
            items.setShelves(myShelves);
            items.removeProductFromBin("secondShelfID", 7, 1);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    expect(setError).toHaveBeenCalled()
})*/
import { render } from "../../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
import { binState } from "@_model/Bin";
import Movement from "@_model/Movement";
import Shelf from "@_model/Shelf";

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('interactionsSlice should set intersecting ids correctly', () => { 
	const selector = (state) => ({
        intersectingIds: state.intersectingIds,
        setIntersectingIds: state.setIntersectingIds
    });

    const intersecting = ["first", "second", "third", "fourth"];

	let firstRender = true;
	let intersectingIds = null;
	effect = jest.fn((items) => {
        intersectingIds = items.intersectingIds;

        if(firstRender) {
            items.setIntersectingIds(intersecting);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(intersectingIds).toEqual(intersecting);
});

test('interactionsSlice should set movingShelf correctly', () => { 
	const selector = (state) => ({
        movingShelf: state.movingShelf,
        setMovingShelf: state.setMovingShelf
    });

	let firstRender = true;
	let movingShelf = null;
	effect = jest.fn((items) => {
        movingShelf = items.movingShelf;

        if(firstRender) {
            items.setMovingShelf("movingShelfId");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(movingShelf).toEqual("movingShelfId");
});

//selectShelf
test('interactionsSlice should set selectedShelf correctly', () => { 
	const selector = (state) => ({
        selectedShelf: state.selectedShelf,
        selectShelf: state.selectShelf
    });

	let firstRender = true;
	let selectedShelf = null;
	effect = jest.fn((items) => {
        selectedShelf = items.selectedShelf;

        if(firstRender) {
            items.selectShelf("myId");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedShelf).toEqual("myId");
});

test('interactionsSlice with selectShelf should deselect selectedBin', () => { 
	const selector = (state) => ({
        selectedBin: state.selectedBin,
        selectShelf: state.selectShelf,
        selectBin: state.selectBin
    });

	let firstRender = true;
    let secondRender = false;
	let selectedBin = '';
	effect = jest.fn((items) => {
        selectedBin = items.selectedBin;

        if(firstRender) {
            items.selectBin("myBinId");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.selectShelf("myShelfId");
            secondRender = false;
        }       
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedBin).toEqual(null);
});

test('interactionsSlice with selectShelf should deselect selectedProduct', () => { 
	const selector = (state) => ({
        selectedProduct: state.selectedProduct,
        selectShelf: state.selectShelf,
        selectProduct: state.selectProduct
    });

	let firstRender = true;
    let secondRender = false;
	let selectedProduct = '';
	effect = jest.fn((items) => {
        selectedProduct = items.selectedProduct;

        if(firstRender) {
            items.selectProduct("myProductId");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.selectShelf("myShelfId");
            secondRender = false;
        }       
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedProduct).toEqual(null);
});

//selectProduct
test('interactionsSlice should set selectedProduct correctly', () => { 
	const selector = (state) => ({
        selectedProduct: state.selectedProduct,
        selectProduct: state.selectProduct
    });

	let firstRender = true;
	let selectedProduct = null;
	effect = jest.fn((items) => {
        selectedProduct = items.selectedProduct;

        if(firstRender) {
            items.selectProduct("myId");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedProduct).toEqual("myId");
});

test('interactionsSlice with selectProduct should deselect selectedBin', () => { 
	const selector = (state) => ({
        selectedBin: state.selectedBin,
        selectProduct: state.selectProduct,
        selectBin: state.selectBin
    });

	let firstRender = true;
    let secondRender = false;
	let selectedBin = '';
	effect = jest.fn((items) => {
        selectedBin = items.selectedBin;

        if(firstRender) {
            items.selectBin("myBinId");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.selectProduct("myProductId");
            secondRender = false;
        }       
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedBin).toEqual(null);
});

test('interactionsSlice with selectProduct should deselect selectedShelf', () => { 
	const selector = (state) => ({
        selectedShelf: state.selectedShelf,
        selectShelf: state.selectShelf,
        selectProduct: state.selectProduct
    });

	let firstRender = true;
    let secondRender = false;
	let selectedShelf = '';
	effect = jest.fn((items) => {
        selectedShelf = items.selectedShelf;

        if(firstRender) {
            items.selectShelf("myShelfId");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.selectProduct("myProductId");
            secondRender = false;
        }       
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedShelf).toEqual(null);
});

//selectBin
test('interactionsSlice should set selectedBin correctly', () => { 
	const selector = (state) => ({
        selectedBin: state.selectedBin,
        selectBin: state.selectBin
    });

	let firstRender = true;
	let selectedBin = null;
	effect = jest.fn((items) => {
        selectedBin = items.selectedBin;

        if(firstRender) {
            items.selectBin("myId");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedBin).toEqual("myId");
});

test('interactionsSlice with selectBin should deselect selectedProduct', () => { 
	const selector = (state) => ({
        selectedProduct: state.selectedProduct,
        selectProduct: state.selectProduct,
        selectBin: state.selectBin
    });

	let firstRender = true;
    let secondRender = false;
	let selectedProduct = '';
	effect = jest.fn((items) => {
        selectedProduct = items.selectedProduct;

        if(firstRender) {
            items.selectProduct("myProductId");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.selectBin("myBinId");
            secondRender = false;
        }       
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedProduct).toEqual(null);
});

test('interactionsSlice with selectBin should deselect selectedShelf', () => { 
	const selector = (state) => ({
        selectedShelf: state.selectedShelf,
        selectShelf: state.selectShelf,
        selectBin: state.selectBin
    });

	let firstRender = true;
    let secondRender = false;
	let selectedShelf = '';
	effect = jest.fn((items) => {
        selectedShelf = items.selectedShelf;

        if(firstRender) {
            items.selectShelf("myShelfId");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.selectBin("myBinId");
            secondRender = false;
        }       
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(selectedShelf).toEqual(null);
});

test('interactionsSlice should set movements correctly', () => { 
	const selector = (state) => ({
        movements: state.movements,
        setMovements: state.setMovements
    });

    const myMovements = [new Movement("first",0,2,"second",7,6), new Movement("third",3,1,"fourth",5,6)];

	let firstRender = true;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.setMovements(myMovements);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(movements).toEqual(myMovements);
});

test('interactionsSlice should order movement correctly', () => {
    const shelves = [
        new Shelf("fromShelf", 4, 4, 6, {x: 1, y: 2, z: 3}, true, "fromShelf"),
        new Shelf("toShelf", 2, 7, 2, {x: 10, y: 2, z: 3}, false, "toShelf")
    ];
    shelves[0].bins[0][0].state = binState.STILL;
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        movements: state.movements
    });

    let firstRender = true;
    let secondRender = false;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.setShelves(shelves);
            items.selectBin("fromShelf+0+0");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.orderMovementFromSelected("toShelf", 1, 6);
            secondRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    let foundMovement = false;
    for (let index = 0; index < movements.length; index++) {
        if(
            movements[index].fromId === "fromShelf" &&
            movements[index].fromRow === 0 &&
            movements[index].fromCol === 0 &&
            movements[index].toId === "toShelf" &&
            movements[index].toRow === 1 &&
            movements[index].toCol === 6
        ) foundMovement = true;    
    }

    expect(foundMovement).toEqual(true);
});

test('interactionsSlice should order movement only if destination bin is empty', () => {
    const shelves = [
        new Shelf("fromShelf", 4, 4, 6, {x: 1, y: 2, z: 3}, true, "fromShelf"),
        new Shelf("toShelf", 2, 7, 2, {x: 10, y: 2, z: 3}, false, "toShelf")
    ];
    shelves[1].bins[1][6].state = binState.STILL;
    shelves[0].bins[1][2].state = binState.STILL;
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        movements: state.movements
    });

    let firstRender = true;
    let secondRender = false;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.setShelves(shelves);
            items.selectBin("fromShelf+1+2");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.orderMovementFromSelected("toShelf", 1, 6);
            secondRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    let foundMovement = false;
    for (let index = 0; index < movements.length; index++) {
        if(
            movements[index].fromId === "fromShelf" &&
            movements[index].fromRow === 1 &&
            movements[index].fromCol === 2 &&
            movements[index].toId === "toShelf" &&
            movements[index].toRow === 1 &&
            movements[index].toCol === 6
        ) foundMovement = true;    
    }

    expect(foundMovement).toEqual(false);
});

test('interactionsSlice should set error in order movement if starting bin is EMPTY', () => {
    const shelves = [
        new Shelf("fromShelf", 4, 4, 6, {x: 1, y: 2, z: 3}, true, "fromShelf"),
        new Shelf("toShelf", 2, 7, 2, {x: 10, y: 2, z: 3}, false, "toShelf")
    ];
    shelves[1].bins[1][6].state = binState.STILL;
    shelves[0].bins[1][2].state = binState.STILL;
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        errorMsg: state.errorMsg
    });

    let firstRender = true;
    let secondRender = false;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(shelves);
            items.selectBin("fromShelf+1+2");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.orderMovementFromSelected("toShelf", 1, 6);
            secondRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(errorMsg).not.toEqual(null);
});

test('interactionsSlice should order movement only from STILL bin', () => {
    const shelves = [
        new Shelf("fromShelf", 4, 4, 6, {x: 1, y: 2, z: 3}, true, "fromShelf"),
        new Shelf("toShelf", 2, 7, 2, {x: 10, y: 2, z: 3}, false, "toShelf")
    ];
    shelves[0].bins[1][2].state = binState.OUTGOING;
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        movements: state.movements
    });

    let firstRender = true;
    let secondRender = false;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.setShelves(shelves);
            items.selectBin("fromShelf+1+2");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.orderMovementFromSelected("toShelf", 1, 6);
            secondRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    let foundMovement = false;
    for (let index = 0; index < movements.length; index++) {
        if(
            movements[index].fromId === "fromShelf" &&
            movements[index].fromRow === 1 &&
            movements[index].fromCol === 2 &&
            movements[index].toId === "toShelf" &&
            movements[index].toRow === 1 &&
            movements[index].toCol === 6
        ) foundMovement = true;    
    }

    expect(foundMovement).toEqual(false);
});

test('interactionsSlice should set error in order movement if starting bin is non-STILL', () => {
    const shelves = [
        new Shelf("fromShelf", 4, 4, 6, {x: 1, y: 2, z: 3}, true, "fromShelf"),
        new Shelf("toShelf", 2, 7, 2, {x: 10, y: 2, z: 3}, false, "toShelf")
    ];
    shelves[0].bins[1][2].state = binState.OUTGOING;
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        errorMsg: state.errorMsg
    });

    let firstRender = true;
    let secondRender = false;
	let errorMsg = null;
	effect = jest.fn((items) => {
        errorMsg = items.errorMsg;

        if(firstRender) {
            items.setShelves(shelves);
            items.selectBin("fromShelf+1+2");
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.orderMovementFromSelected("toShelf", 1, 6);
            secondRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(errorMsg).not.toEqual(null);
});

test('interactionslice should remove movements involved with specific bin (from bin)', () => { 
    const shelves = [
        new Shelf("fromShelf", 4, 4, 6, {x: 1, y: 2, z: 3}, true, "fromShelf"),
        new Shelf("toShelf", 2, 7, 2, {x: 10, y: 2, z: 3}, false, "toShelf")
    ];
    shelves[0].bins[0][0].state = binState.STILL;
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        removeMovementsWithBin: state.removeMovementsWithBin,
        movements: state.movements
    });

    let firstRender = true;
    let secondRender = false;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.setShelves(shelves);
            items.selectBin("fromShelf+0+0");
            items.orderMovementFromSelected("toShelf", 1, 6);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.removeMovementsWithBin("fromShelf", 0, 0);
            secondRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(movements.length).toEqual(0);
});

test('interactionslice should remove movements involved with specific bin (to bin)', () => { 
    const shelves = [
        new Shelf("fromShelf", 4, 4, 6, {x: 1, y: 2, z: 3}, true, "fromShelf"),
        new Shelf("toShelf", 2, 7, 2, {x: 10, y: 2, z: 3}, false, "toShelf")
    ];
    shelves[0].bins[0][0].state = binState.STILL;
    
    const selector = (state) => ({
        setShelves: state.setShelves,
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        removeMovementsWithBin: state.removeMovementsWithBin,
        movements: state.movements
    });

    let firstRender = true;
    let secondRender = false;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.setShelves(shelves);
            items.selectBin("fromShelf+0+0");
            items.orderMovementFromSelected("toShelf", 1, 6);
            firstRender = false;
            secondRender = true;
        } else if(secondRender) {
            items.removeMovementsWithBin("toShelf", 1, 6);
            secondRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(movements.length).toEqual(0);
});
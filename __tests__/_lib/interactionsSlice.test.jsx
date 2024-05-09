import { render } from "../../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
import Movement from "@_model/Movement";
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
jest.mock('../../_lib/whsSlice.js', () => {
	return {
		whsSlice: (set, get) => ({ })
	}
});

// binState MOCK
jest.mock('../../_model/Bin.js', () => {
	return {
		binState: {
            EMPTY: "EMPTY",
            STILL: "STILL",
            INCOMING: "INCOMING",
            OUTGOING: "OUTGOING"
        }
	}
});

// shelvesSlice MOCK
const removeProductFromBin = jest.fn();
jest.mock('../../_lib/shelvesSlice.js', () => {
    const shelves = [
        {
            id: "fromShelfID",
            name: "fromShelf",
            binSize: 4,
            width: 3,
            height: 2,
            isFlipped: true,
            position: {
                x: 4,
                y: 5,
                z: 7
            },
            bins: [
                [
                    {
                        id: "fromShelfID+0+0",
                        productId: "myProductId",
                        state: "STILL"
                    },
                    {
                        id: "fromShelfID+0+1",
                        productId: null,
                        state: "EMPTY"
                    },
                    {
                        id: "fromShelfID+0+2",
                        productId: null,
                        state: "EMPTY"
                    }
                ],
                [
                    {
                        id: "fromShelfID+1+0",
                        productId: null,
                        state: "EMPTY"
                    },
                    {
                        id: "fromShelfID+1+1",
                        productId: null,
                        state: "EMPTY"
                    },
                    {
                        id: "fromShelfID+1+2",
                        productId: "outGoingProd",
                        state: "OUTGOING"
                    }
                ]
            ]
        },
        {
            id: "toShelfID",
            name: "toShelf",
            binSize: 6,
            width: 1,
            height: 3,
            isFlipped: false,
            position: {
                x: 5,
                y: 20,
                z: 10
            },
            bins: [
                [
                    {
                        id: "toShelfID+0+0",
                        productId: null,
                        state: "EMPTY"
                    }
                ],
                [
                    {
                        id: "toShelfID+1+0",
                        productId: null,
                        state: "EMPTY"
                    }
                ],
                [
                    {
                        id: "toShelfID+2+0",
                        productId: "someOtherProduct",
                        state: "STILL"
                    }
                ]
            ]
        }
    ];
	return {
		shelvesSlice: (set, get) => ({
			shelves: shelves,
            updateBinState: jest.fn(),
            insertProduct: jest.fn(),
            removeProductFromBin: (idShelf, row, col) => removeProductFromBin(idShelf, row, col)
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
	let selectedBin = '';
	effect = jest.fn((items) => {
        selectedBin = items.selectedBin;

        if(firstRender) {
            items.selectBin("myBinId");
            items.selectShelf("myShelfId");
            firstRender = false;
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
	let selectedProduct = '';
	effect = jest.fn((items) => {
        selectedProduct = items.selectedProduct;

        if(firstRender) {
            items.selectProduct("myProductId");
            items.selectShelf("myShelfId");
            firstRender = false;
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
	let selectedBin = '';
	effect = jest.fn((items) => {
        selectedBin = items.selectedBin;

        if(firstRender) {
            items.selectBin("myBinId");
            items.selectProduct("myProductId");
            firstRender = false;
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
	let selectedShelf = '';
	effect = jest.fn((items) => {
        selectedShelf = items.selectedShelf;

        if(firstRender) {
            items.selectShelf("myShelfId");
            items.selectProduct("myProductId");
            firstRender = false;
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
	let selectedProduct = '';
	effect = jest.fn((items) => {
        selectedProduct = items.selectedProduct;

        if(firstRender) {
            items.selectProduct("myProductId");
            items.selectBin("myBinId");
            firstRender = false;
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
	let selectedShelf = '';
	effect = jest.fn((items) => {
        selectedShelf = items.selectedShelf;

        if(firstRender) {
            items.selectShelf("myShelfId");
            items.selectBin("myBinId");
            firstRender = false;
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
    const selector = (state) => ({
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        movements: state.movements
    });

    let firstRender = true;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.selectBin("fromShelfID+0+0");
            items.orderMovementFromSelected("toShelfID", 1, 0);
            firstRender = false;
        }      
    });

    render(<TestComponent elements={selector} effect={effect} />);

    let foundMovement = false;
    for (let index = 0; index < movements.length; index++) {
        if(
            movements[index].fromId === "fromShelfID" &&
            movements[index].fromRow === 0 &&
            movements[index].fromCol === 0 &&
            movements[index].toId === "toShelfID" &&
            movements[index].toRow === 1 &&
            movements[index].toCol === 0
        ) foundMovement = true;    
    }

    expect(foundMovement).toEqual(true);
});

test('interactionsSlice should order movement only if destination bin is empty', () => {
    const selector = (state) => ({
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        movements: state.movements
    });

    let firstRender = true;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.selectBin("fromShelfID+0+0");
            items.orderMovementFromSelected("toShelfID", 2, 0);
            firstRender = false;
        }     
    });

    render(<TestComponent elements={selector} effect={effect} />);

    let foundMovement = false;
    for (let index = 0; index < movements.length; index++) {
        if(
            movements[index].fromId === "fromShelfID" &&
            movements[index].fromRow === 0 &&
            movements[index].fromCol === 0 &&
            movements[index].toId === "toShelfID" &&
            movements[index].toRow === 2 &&
            movements[index].toCol === 0
        ) foundMovement = true;    
    }

    expect(foundMovement).toEqual(false);
});

test('interactionsSlice should set error in order movement if starting bin is EMPTY', () => {
    const selector = (state) => ({
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        errorMsg: state.errorMsg
    });

    let firstRender = true;
	effect = jest.fn((items) => {
        if(firstRender) {
            items.selectBin("fromShelfID+0+1");
            items.orderMovementFromSelected("toShelfID", 0, 0);
            firstRender = false;
        }       
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(setError).toHaveBeenCalled();
});

test('interactionsSlice should order movement only from STILL bin, it should set error otherwise', () => {
    const selector = (state) => ({
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        movements: state.movements
    });

    let firstRender = true;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.selectBin("fromShelfID+1+2");
            items.orderMovementFromSelected("toShelfID", 1, 0);
            firstRender = false;
        }      
    });

    render(<TestComponent elements={selector} effect={effect} />);

    let foundMovement = false;
    for (let index = 0; index < movements.length; index++) {
        if(
            movements[index].fromId === "fromShelfID" &&
            movements[index].fromRow === 1 &&
            movements[index].fromCol === 2 &&
            movements[index].toId === "toShelfID" &&
            movements[index].toRow === 1 &&
            movements[index].toCol === 0
        ) foundMovement = true;    
    }

    expect(foundMovement).toEqual(false);
    expect(setError).toHaveBeenCalled();
});

test('interactionslice should remove movements involved with specific bin (from bin) and call removeProductFromBin with incoming bin', () => {     
    const selector = (state) => ({
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        removeMovementsWithBin: state.removeMovementsWithBin,
        movements: state.movements
    });

    let firstRender = true;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.selectBin("fromShelfID+0+0");
            items.orderMovementFromSelected("toShelfID", 1, 0);
            items.removeMovementsWithBin("fromShelfID", 0, 0);
            firstRender = false;
        }      
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(movements.length).toEqual(0);
    expect(removeProductFromBin).toHaveBeenCalledWith("toShelfID", 1, 0);
});

test('interactionslice should remove movements involved with specific bin (to bin) and call removeProductFromBin with outgoing bin', () => { 
    const selector = (state) => ({
        selectBin: state.selectBin,
        orderMovementFromSelected: state.orderMovementFromSelected,
        removeMovementsWithBin: state.removeMovementsWithBin,
        movements: state.movements
    });

    let firstRender = true;
	let movements = null;
	effect = jest.fn((items) => {
        movements = items.movements;

        if(firstRender) {
            items.selectBin("fromShelfID+0+0");
            items.orderMovementFromSelected("toShelfID", 1, 0);
            items.removeMovementsWithBin("toShelfID", 1, 0);
            firstRender = false;
        }     
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(movements.length).toEqual(0);
    expect(removeProductFromBin).toHaveBeenCalledWith("fromShelfID", 0, 0);
});
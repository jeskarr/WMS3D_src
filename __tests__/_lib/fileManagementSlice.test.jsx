import Shelf from "@_model/Shelf";
import { render } from "../../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
import Product from "@_model/Product";
import Movement from "@_model/Movement";
import { binState } from "@_model/Bin";

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('fileManagementSlice should interpret SVG points correctly', () => { 
    const selector = (state) => ({
        points: state.points,
		svgToState: state.svgToState
    });

    const svg = `
        <svg height="400" width="700">
            <polygon points="200,0 700,0 700,200 500,400 0,400, 0,200"/>
        </svg>
    `;

	let firstRender = true;
	let points = null;
	effect = jest.fn((items) => {
		points = items.points;

        if(firstRender) {
            items.svgToState(svg, 44);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

    expect(points).toContainEqual({x: 350, z: 200});
    expect(points).toContainEqual({x: 350, z: 0});
    expect(points).toContainEqual({x: 150, z: -200});
    expect(points).toContainEqual({x: -350, z: -200});
    expect(points).toContainEqual({x: -350, z: 0});
    expect(points).toContainEqual({x: -150, z: 200});
});

test('fileManagementSlice should not add more points when reading from SVG', () => { 
    const selector = (state) => ({
        points: state.points,
		svgToState: state.svgToState
    });

    const svg = `
        <svg height="260" width="500">
            <polygon points="300,210 170,250 123,234 100,40"/>
        </svg>
    `;

	let firstRender = true;
	let points = null;
	effect = jest.fn((items) => {
		points = items.points;

        if(firstRender) {
            items.svgToState(svg, 20);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

    expect(points.length).toEqual(4);
});

test('fileManagementSlice should set height when building whs from SVG', () => { 
    const selector = (state) => ({
        whsHeight: state.whsHeight,
		svgToState: state.svgToState
    });

    const svg = `
        <svg height="260" width="500">
            <polygon points="220,10 300,210 170,250 123,234 100,40 120,20"/>
        </svg>
    `;

	let firstRender = true;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;

        if(firstRender) {
            items.svgToState(svg, 32);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).toEqual(32);
});

test('fileManagementSlice stateToJson should produce a correct JSON', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 2, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 1, 3, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    const myProducts = [new Product("firstProd", {r: 2, g: 20, b: 200}, "myProductId")];
    myShelves[1].bins[2][0].state = binState.OUTGOING;
    myShelves[1].bins[2][0].productId = "myProductId";
    myShelves[0].bins[1][1].state = binState.INCOMING;
    myShelves[0].bins[1][1].productId = "myProductId";
    const myMovements = [new Movement("secondShelfID",2,0,"firstShelfID",1,1,"firstMovementId")];

    const selector = (state) => ({
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition,
        setWhsRectangle: state.setWhsRectangle,
        setMovements: state.setMovements,
        setProducts: state.setProducts,
        setWhsName: state.setWhsName,
        stateToJson: state.stateToJson,
    });

    let firstRender = true;
    let json = null;
    effect = jest.fn((items) => {
        json = items.stateToJson();

        if(firstRender) {
            items.setWhsName("myWhs");
            items.setWhsRectangle(50, 65, 45);
            items.setProducts(myProducts);
            items.setShelves(myShelves);
            items.setMovements(myMovements);
            firstRender = false;
        }
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(json.whsName).toEqual("myWhs");
    expect(json.whsHeight).toEqual(45);
    expect(json.whsPoints.length).toEqual(4);
    expect(json.whsPoints).toContainEqual({x: 32.5, z: 25});
	expect(json.whsPoints).toContainEqual({x: -32.5, z: 25});
	expect(json.whsPoints).toContainEqual({x: -32.5, z: -25});
	expect(json.whsPoints).toContainEqual({x: 32.5, z: -25});
    expect(json.products).toEqual([
        {
            name: "firstProd", 
            color: {r: 2, g: 20, b: 200},
            id: "myProductId"
        }
    ]);
    expect(json.shelves).toEqual([
        {
            id: "firstShelfID",
            name: "firstShelf",
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
                        id: "firstShelfID+0+0",
                        productId: null,
                        state: binState.EMPTY
                    },
                    {
                        id: "firstShelfID+0+1",
                        productId: null,
                        state: binState.EMPTY
                    },
                    {
                        id: "firstShelfID+0+2",
                        productId: null,
                        state: binState.EMPTY
                    }
                ],
                [
                    {
                        id: "firstShelfID+1+0",
                        productId: null,
                        state: binState.EMPTY
                    },
                    {
                        id: "firstShelfID+1+1",
                        productId: "myProductId",
                        state: binState.INCOMING
                    },
                    {
                        id: "firstShelfID+1+2",
                        productId: null,
                        state: binState.EMPTY
                    }
                ]
            ]
        },
        {
            id: "secondShelfID",
            name: "secondShelf",
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
                        id: "secondShelfID+0+0",
                        productId: null,
                        state: binState.EMPTY
                    }
                ],
                [
                    {
                        id: "secondShelfID+1+0",
                        productId: null,
                        state: binState.EMPTY
                    }
                ],
                [
                    {
                        id: "secondShelfID+2+0",
                        productId: "myProductId",
                        state: binState.OUTGOING
                    }
                ]
            ]
        }
    ]);
    expect(json.movements).toEqual([
        {
            id: "firstMovementId",
            fromId: "secondShelfID",
            fromRow: 2,
            fromCol: 0,
            toId: "firstShelfID",
            toRow: 1,
            toCol: 1
        }
    ]);
});

test('fileManagementSlice JsonToState should produce a correct state', () => {
    let json = `{
        "whsName": "MyFirstWhs",
        "whsHeight": 31,
        "whsPoints": [
            {
                "x": 0,
                "z": 0
            },
            {
                "x": 0,
                "z": 50
            },
            {
                "x": 53,
                "z": 0
            },
            {
                "x": 53,
                "z": 50
            }
        ],
        "products": [
            {
                "name": "firstProd", 
                "color": {"r": 2, "g": 20, "b": 200},
                "id": "myProductId"
            }
        ],
        "shelves": [
            {
                "id": "firstShelfID",
                "name": "firstShelf",
                "binSize": 4,
                "width": 3,
                "height": 2,
                "isFlipped": true,
                "position": {
                    "x": 4,
                    "y": 5,
                    "z": 7
                },
                "bins": [
                    [
                        {
                            "id": "firstShelfID+0+0",
                            "productId": null,
                            "state": "EMPTY"
                        },
                        {
                            "id": "firstShelfID+0+1",
                            "productId": null,
                            "state": "EMPTY"
                        },
                        {
                            "id": "firstShelfID+0+2",
                            "productId": null,
                            "state": "EMPTY"
                        }
                    ],
                    [
                        {
                            "id": "firstShelfID+1+0",
                            "productId": null,
                            "state": "EMPTY"
                        },
                        {
                            "id": "firstShelfID+1+1",
                            "productId": "myProductId",
                            "state": "INCOMING"
                        },
                        {
                            "id": "firstShelfID+1+2",
                            "productId": null,
                            "state": "EMPTY"
                        }
                    ]
                ]
            },
            {
                "id": "secondShelfID",
                "name": "secondShelf",
                "binSize": 6,
                "width": 1,
                "height": 3,
                "isFlipped": false,
                "position": {
                    "x": 5,
                    "y": 20,
                    "z": 10
                },
                "bins": [
                    [
                        {
                            "id": "secondShelfID+0+0",
                            "productId": null,
                            "state": "EMPTY"
                        }
                    ],
                    [
                        {
                            "id": "secondShelfID+1+0",
                            "productId": null,
                            "state": "EMPTY"
                        }
                    ],
                    [
                        {
                            "id": "secondShelfID+2+0",
                            "productId": "myProductId",
                            "state": "OUTGOING"
                        }
                    ]
                ]
            }
        ],
        "movements": [
            {
                "id": "firstMovementId",
                "fromId": "secondShelfID",
                "fromRow": 2,
                "fromCol": 0,
                "toId": "firstShelfID",
                "toRow": 1,
                "toCol": 1
            }
        ]
    }`;

    const selector = (state) => ({
        shelves: state.shelves,
        whsName: state.whsName,
        whsHeight: state.whsHeight,
        whsPoints: state.points,
        products: state.products,
        movements: state.movements,
        jsonToState: state.jsonToState,
    });

    let firstRender = true;
    let shelves = null;
    let products = null;
    let movements = null;
    let whsName = null;
    let whsHeight = null;
    let whsPoints = null;
    effect = jest.fn((items) => {
        whsName = items.whsName;
        whsHeight = items.whsHeight;
        whsPoints = items.whsPoints;
        products = items.products;
        shelves = items.shelves;
        movements = items.movements;

        if(firstRender) {
            try{
            items.jsonToState(json);} catch(e) {console.log(e.msg)}
            firstRender = false;
        }
    });

    render(<TestComponent elements={selector} effect={effect} />);

    expect(whsName).toEqual("MyFirstWhs");
    expect(whsHeight).toEqual(31);
    expect(whsPoints.length).toEqual(4);
    expect(whsPoints).toContainEqual({x: 0, z: 0});
	expect(whsPoints).toContainEqual({x: 0, z: 50});
	expect(whsPoints).toContainEqual({x: 53, z: 0});
	expect(whsPoints).toContainEqual({x: 53, z: 50});
    expect(products).toEqual([new Product("firstProd", {r: 2, g: 20, b: 200}, "myProductId")]);
    expect(movements).toEqual([new Movement("secondShelfID", 2, 0, "firstShelfID", 1, 1, "firstMovementId")]);
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = binState.STILL;
    myShelves[1].bins[7][1].productId = "myProductId";
    expect(shelves).toEqual(myShelves);    
});
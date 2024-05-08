import ShelvesRender from '../../../_components/render/ShelvesRender';
import ReactThreeTestRenderer from '../../../node_modules/@react-three/test-renderer';
import { render, fireEvent } from '../../../node_modules/@testing-library/react';
import "../../../node_modules/@testing-library/jest-dom";
import "@__mocks__/matchMedia.mock";
import { waitFor } from "../../../node_modules/@testing-library/react";
import { Extrude } from '../../../node_modules/@react-three/drei';
import * as Three from 'three';

let mockData = {};

// STORE MOCK
import { boundStore } from "../../../_lib/boundStore";
jest.mock('../../../_lib/boundStore');
beforeEach(() => {
    boundStore.mockImplementation((passedFunction) => { 
        const data = mockData;
        return passedFunction(data);
    });
});

jest.mock("../../../node_modules/@react-three/drei", () => {
    return { 
        TransformControls: (props) => {
            return <mesh
                onMouseUp={props.onMouseUp}
            />;
        },
        Edges: (props) => {
            return <mesh/>;
        }
    }
});

const ref = {
    current: {
        children: [],
    }
};

const wallsRef = {
    current: {
        children: []
    }
};

describe('Shelves behaviour when clicked and moved', () => {
    test('ShelvesRender correctly creates a shelf from the boundStore', async () => {
        mockData = {
            products: [
                {
                    name: "myProd", 
                    color: {r: 2, g: 20, b: 200},
                    id: "myProductId"
                }
            ],
            shelves: [ 
                {
                    id: "myActiveShelfID",
                    name: "myActiveShelf",
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
                                id: "myActiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+1+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+2+0",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                }
            ]
        };
        const renderer = await ReactThreeTestRenderer.create(<ShelvesRender ref={ref}/>);
        const shelfChildren = renderer.scene.children[0].allChildren;
        expect(shelfChildren.length).toEqual(3);
    });

    test("ShelvesRender should select a shelf when you click one of its bins once", async () => {
        mockData = {
            products: [
                {
                    name: "myProd", 
                    color: {r: 2, g: 20, b: 200},
                    id: "myProductId"
                }
            ],
            shelves: [ 
                {
                    id: "myActiveShelfID",
                    name: "myActiveShelf",
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
                                id: "myActiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+1+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+2+0",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                }
            ],
            selectShelf: jest.fn()
        };
        const renderer = await ReactThreeTestRenderer.create(<ShelvesRender ref={ref}/>);

        const bin = renderer.scene.children[0].children[0];
        await renderer.fireEvent(bin, 'click');
        await waitFor(() => {expect(mockData.selectShelf).toBeCalled()});
    });

    test("ShelvesRender should select a bin when you click one of its bins twice", async () => {
        mockData = {
            products: [
                {
                    name: "myProd", 
                    color: {r: 2, g: 20, b: 200},
                    id: "myProductId"
                }
            ],
            shelves: [ 
                {
                    id: "myActiveShelfID",
                    name: "myActiveShelf",
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
                                id: "myActiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+0+1",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+0+2",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                }
            ],
            selectedShelf: "myActiveShelfID",
            selectShelf: jest.fn(),
            selectBin: jest.fn()
        };
        const renderer = await ReactThreeTestRenderer.create(<ShelvesRender ref={ref}/>);

        const bin = renderer.scene.children[0].children[0];
        await renderer.fireEvent(bin, 'click');
        await waitFor(() => {expect(mockData.selectBin).toBeCalled()});
    });

    test('ShelvesRender should deselect a shelf when you click outside of it', async () => {
        mockData = {
            shelves: [ 
                {
                    id: "myActiveShelfID",
                    name: "myActiveShelf",
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
                                id: "myActiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+1+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+2+0",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                }
            ],
            products: [
                {
                    name: "myProd", 
                    color: {r: 2, g: 20, b: 200},
                    id: "myProductId"
                }
            ],
            selectedShelf: "myActiveShelfID",
            selectShelf: jest.fn()
        };

        const renderer = await ReactThreeTestRenderer.create(<ShelvesRender ref={ref}/>);

        // Simulate a click event outside of the ShelvesRender component
        await renderer.fireEvent(renderer.scene.children[0], 'pointerMissed');

        // Assert that the handleUnclickMock function is called
        expect(mockData.selectShelf).toHaveBeenCalled();
    });

    test('ShelvesRender should manage the shelf movements when the transformControls are used', async () => {
        mockData = {
            shelves: [ 
                {
                    id: "myActiveShelfID",
                    name: "myActiveShelf",
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
                                id: "myActiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+1+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+2+0",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                }
            ],
            products: [
                {
                    name: "myProd", 
                    color: {r: 2, g: 20, b: 200},
                    id: "myProductId"
                }
            ],
            selectedShelf: "myActiveShelfID",
            movingShelf: "myActiveShelfID",
            setIntersectingIds: jest.fn(),
            updateShelfPosition: jest.fn()
        };  

        const renderer = await ReactThreeTestRenderer.create(<ShelvesRender ref={ref} wallsRef={wallsRef}/>);
        const transformControls = renderer.scene.children[1];
        await renderer.fireEvent(transformControls, 'mouseUp');

        await waitFor(() => {expect(mockData.updateShelfPosition).toBeCalled()});
    });

    test('ShelvesRender should check for any collisions whenever a shelf is moved', async () => {
        mockData = {
            shelves: [ 
                {
                    id: "myActiveShelfID",
                    name: "myActiveShelf",
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
                                id: "myActiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+1+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+2+0",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                },
                {
                    id: "myInactiveShelfID",
                    name: "myInactiveShelf",
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
                                id: "myInactiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myInactiveShelfID+1+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myInactiveShelfID+2+0",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                }
            ],
            products: [
                {
                    name: "myProd", 
                    color: {r: 2, g: 20, b: 200},
                    id: "myProductId"
                }
            ],
            selectedShelf: "myActiveShelfID",
            movingShelf: "myActiveShelfID",
            setIntersectingIds: jest.fn(),
            updateShelfPosition: jest.fn()
        };  

        const renderer = await ReactThreeTestRenderer.create(<ShelvesRender ref={ref} wallsRef={wallsRef}/>);
        const transformControls = renderer.scene.children[2];
        await renderer.fireEvent(transformControls, 'mouseUp');

        await waitFor(() => {expect(mockData.updateShelfPosition).toBeCalled()});
    });

    test('ShelvesRender should update the boundStore when a shelf is rotated', async () => {
        mockData = {
            shelves: [ 
                {
                    id: "myActiveShelfID",
                    name: "myActiveShelf",
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
                                id: "myActiveShelfID+0+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+1+0",
                                productId: null,
                                state: "EMPTY"
                            }
                        ],
                        [
                            {
                                id: "myActiveShelfID+2+0",
                                productId: "myProductId",
                                state: "STILL"
                            }
                        ]
                    ]
                }
            ],
            products: [
                {
                    name: "myProd", 
                    color: {r: 2, g: 20, b: 200},
                    id: "myProductId"
                }
            ],
            selectedShelf: "myActiveShelfID",
            movingShelf: "myActiveShelfID",
            setIntersectingIds: jest.fn(),
            flipShelf: jest.fn()
        };  

        const renderer = await ReactThreeTestRenderer.create(<ShelvesRender ref={ref} wallsRef={wallsRef}/>);

        const transformControls = renderer.scene.children[2];
        await (mockData.shelves[0].isFlipped = true);
        renderer.fireEvent(transformControls, 'mouseUp');

        await waitFor(() => {expect(mockData.flipShelf).toBeCalled()});
    });
});
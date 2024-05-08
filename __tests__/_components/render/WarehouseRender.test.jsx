import WarehouseRender from "@_components/render/WarehouseRender";
import ReactThreeTestRenderer from '../../../node_modules/@react-three/test-renderer';
import "../../../node_modules/@testing-library/jest-dom";
import "@__mocks__/matchMedia.mock";

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

test('WarehouseRender should render warehouse mesh and shelves render', async () => {
    mockData = {
        points: [
            {
                x: 0,
                z: 0
            },
            {
                x: 0,
                z: 50
            },
            {
                x: 53,
                z: 0
            },
            {
                x: 53,
                z: 50
            }
        ],  
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
    };

    const renderer = await ReactThreeTestRenderer.create(<WarehouseRender />);
    // WarehouseRender: renderer.scene.children[0]
    expect(renderer.scene.children.length).toEqual(2);
});
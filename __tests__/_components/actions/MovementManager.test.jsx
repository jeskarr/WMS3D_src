import MovementManager from "@_components/actions/MovementManager";
import { fireEvent, render, screen, act, waitFor } from "../../../node_modules/@testing-library/react";
import "../../../__mocks__/matchMedia.mock"

let mockData = {
    movements: [{
        id: "firstMovementId",
        fromId: "secondShelfID",
        fromRow: 2,
        fromCol: 0,
        toId: "firstShelfID",
        toRow: 1,
        toCol: 1
    }],
    shelves: [{
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
                    state: "EMPTY"
                },
                {
                    id: "firstShelfID+0+1",
                    productId: null,
                    state: "EMPTY"
                },
                {
                    id: "firstShelfID+0+2",
                    productId: null,
                    state: "EMPTY"
                }
            ],
            [
                {
                    id: "firstShelfID+1+0",
                    productId: null,
                    state: "EMPTY"
                },
                {
                    id: "firstShelfID+1+1",
                    productId: "myProductId",
                    state: "INCOMING"
                },
                {
                    id: "firstShelfID+1+2",
                    productId: null,
                    state: "EMPTY"
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
                    state: "EMPTY"
                }
            ],
            [
                {
                    id: "secondShelfID+1+0",
                    productId: null,
                    state: "EMPTY"
                }
            ],
            [
                {
                    id: "secondShelfID+2+0",
                    productId: "myProductId",
                    state: "OUTGOING"
                }
            ]
        ]
    }],
    removeMovementsWithBin: jest.fn(),
    updateBinState: jest.fn()
};

// STORE MOCK
import { boundStore } from "../../../_lib/boundStore";
jest.mock('../../../_lib/boundStore');
beforeEach(() => {
    boundStore.mockImplementation((passedFunction) => { 
        const data = mockData;
        return passedFunction(data);
    });
});

const open = true;
const closeView = jest.fn();

// TEST DI INTEGRAZIONE: MovementManager + MovementView
describe('Requesting movements', () => { 
    test('MovementManager should call updateBinState and removeMovementsWithBin with toShelf params if movement request returns true', async () => {
        global.fetch = jest.fn((string, request)=>{
            return {
                json() {
                    return {
                        msg: "Request accepted",
                        requestStatus: true
                    }
                }            
            }
        });    
    
        render(<MovementManager open={open} closeView={closeView} />);
        act(() => fireEvent.click(screen.getByText(/sollecita/i)));
    
        await waitFor(() => {
            expect(mockData.updateBinState).toHaveBeenCalledWith("firstShelfID", 1, 1, "STILL");
            expect(mockData.removeMovementsWithBin).toHaveBeenCalledWith("firstShelfID", 1, 1);
        });
    });

    test('MovementManager should call updateBinState and removeMovementsWithBin with fromShelf params if movement request returns false', async () => {
        global.fetch = jest.fn((string, request)=>{
            return {
                json() {
                    return {
                        msg: "Request denied",
                        requestStatus: false
                    }
                }            
            }
        });    
    
        render(<MovementManager open={open} closeView={closeView} />);
        act(() => fireEvent.click(screen.getByText(/sollecita/i)));
    
        await waitFor(() => {
            expect(mockData.updateBinState).toHaveBeenCalledWith("secondShelfID", 2, 0, "STILL");
            expect(mockData.removeMovementsWithBin).toHaveBeenCalledWith("secondShelfID", 2, 0);
        });
    });
});

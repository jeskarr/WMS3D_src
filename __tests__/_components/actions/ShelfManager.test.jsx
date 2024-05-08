import ShelfManager from "@_components/actions/ShelfManager";
import { render, screen, act, waitFor, fireEvent } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import userEvent from "../../../node_modules/@testing-library/user-event";
import "@__mocks__/matchMedia.mock";

const setConfig = jest.fn();
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

// TEST DI INTEGRAZIONE: ShelfManager + (ShelfCard, ShelfConfigurator, ErrorModal)
describe("Adding/Editing a shelf", () => {
    test('ShelfManager should pass correct parameter to action addShelf on submit new shelf from ShelfConfigurator', async () => {
        let sName = null;
        let sBinSize = null;
        let sHeight = null;
        let sWidth = null;
        mockData = {
            addShelf: jest.fn().mockImplementation((name, binSize, height, width) => {
                sName = name;
                sBinSize = binSize;
                sHeight = height;
                sWidth = width;
            })
        };

        render(<ShelfManager config={true} setConfig={setConfig} />);

        const nameInput = screen.getByLabelText(/nome/i);
        const binSizeInput = screen.getByLabelText(/dimensione.*bin.*/i);
        const widthInput = screen.getByLabelText(/larghezza/i);
        const heightInput = screen.getByLabelText(/altezza/i);        
        const submitBt = screen.getByText(/vai al posizionamento/i);

        await userEvent.type(nameInput, "NewShelfName");
        await userEvent.clear(binSizeInput);
        await userEvent.type(binSizeInput, "5");
        await userEvent.clear(widthInput);
        await userEvent.type(widthInput, "8");
        await userEvent.clear(heightInput);
        await userEvent.type(heightInput, "10");
        
        act(() => fireEvent.click(submitBt));
        await waitFor(() => {
            expect(sName).toEqual("NewShelfName");
            expect(sBinSize).toEqual(5);
            expect(sWidth).toEqual(8);
            expect(sHeight).toEqual(10);
        });
    });

    test('ShelfManager should call action updateShelfPosition on submit new shelf from ShelfConfigurator (step 1)', async () => {
        mockData = {
            addShelf: jest.fn(),
            updateShelfPosition: jest.fn(),
            selectShelf: jest.fn(),
            setMovingShelf: jest.fn(),
            movingShelf: "firstShelfID",
            errorMsg: null,
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
            }]
        };

        render(<ShelfManager config={true} setConfig={setConfig} />);

        const nameInput = screen.getByLabelText(/nome/i);

        await userEvent.type(nameInput, "NewShelfName");

        const submitBt = screen.getByText(/vai al posizionamento/i);        
        act(() => fireEvent.click(submitBt));
        
        const positionBt = await screen.findByText("Aggiungi", {exact: true});
        act(() => fireEvent.click(positionBt));

        await waitFor(() => {expect(mockData.updateShelfPosition).toBeCalled()});
    });

    test('ShelfManager should pass correct parameter to action updateShelfInfo on submit edited shelf from ShelfConfigurator', async () => {
        let config = false;
        const setConfig = jest.fn((value) => config = value);

        let sName = null;
        let sBinSize = null;
        let sHeight = null;
        let sWidth = null;
        mockData = {
            updateShelfInfo: jest.fn().mockImplementation((id, name, binSize, width, height) => {
                sName = name;
                sBinSize = binSize;
                sHeight = height;
                sWidth = width;
            }),
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
            }],
            selectedShelf: "firstShelfID",
            errorMsg: null,
            setMovingShelf: jest.fn(),
            selectShelf: jest.fn(),
            updateShelfPosition: jest.fn()
        };

        const {rerender} = render(<ShelfManager config={config} setConfig={setConfig} />);

        const editBt = screen.getByTestId("ShelfEditButton");        
        fireEvent.click(editBt);
        await waitFor(() => {expect(setConfig).toHaveBeenCalledWith(true);});

        rerender(<ShelfManager config={config} setConfig={setConfig} />)

        const nameInput = screen.getByLabelText(/nome/i);
        const binSizeInput = screen.getByLabelText(/dimensione.*bin.*/i);
        const widthInput = screen.getByLabelText(/larghezza/i);
        const heightInput = screen.getByLabelText(/altezza/i);        
        const submitBt = screen.getByText(/vai al posizionamento/i);

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, "NewShelfName");
        await userEvent.clear(binSizeInput);
        await userEvent.type(binSizeInput, "5");
        await userEvent.clear(widthInput);
        await userEvent.type(widthInput, "8");
        await userEvent.clear(heightInput);
        await userEvent.type(heightInput, "10");
        act(() => fireEvent.click(submitBt));
        await waitFor(() => {
            expect(sName).toEqual("NewShelfName");
            expect(sBinSize).toEqual(5);
            expect(sWidth).toEqual(8);
            expect(sHeight).toEqual(10);
        });
    });

    test('ShelfManager should call updateShelfPosition on cancel in editing existing shelf in ShelfConfigurator (step 1)', async () => {
        let config = false;
        const setConfig = jest.fn((value) => config = value);
        mockData = {
            updateShelfInfo: jest.fn(),
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
            }],
            selectedShelf: "firstShelfID",
            errorMsg: null,
            setMovingShelf: jest.fn(),
            selectShelf: jest.fn(),
            updateShelfPosition: jest.fn()
        };

        const {rerender} = render(<ShelfManager config={config} setConfig={setConfig} />);

        const editBt = screen.getByTestId("ShelfEditButton");        
        fireEvent.click(editBt);
        await waitFor(() => {expect(setConfig).toHaveBeenCalledWith(true);});

        rerender(<ShelfManager config={config} setConfig={setConfig} />)

        const submitBt = screen.getByText(/vai al posizionamento/i);
        act(() => fireEvent.click(submitBt));

        await waitFor(()=>{expect(mockData.updateShelfInfo).toBeCalled()});
        await waitFor(() => {expect(screen.getByText("Modifica", {exact: true})).toBeInTheDocument()});
        const cancelBt = await screen.findByText("Annulla", {exact: true});
        act(() => fireEvent.click(cancelBt));

        await waitFor(() => {expect(mockData.updateShelfPosition).toBeCalled()});
    });

    test("ShelfManager should reset fields in ShefConfigurator on cancel (step 0)", async () => {
        mockData = {
            setMovingShelf: jest.fn(),
            updateShelfPosition: jest.fn()
        };

        render(<ShelfManager config={true} setConfig={setConfig} />);

        const nameInput = screen.getByLabelText(/nome/i);
        const binSizeInput = screen.getByLabelText(/dimensione.*bin.*/i);
        const widthInput = screen.getByLabelText(/larghezza/i);
        const heightInput = screen.getByLabelText(/altezza/i);        
        const cancelBt = screen.getByText(/annulla/i);

        await userEvent.type(nameInput, "NewShelfName");
        await userEvent.clear(binSizeInput);
        await userEvent.type(binSizeInput, "5");
        await userEvent.clear(widthInput);
        await userEvent.type(widthInput, "8");
        await userEvent.clear(heightInput);
        await userEvent.type(heightInput, "10");
        
        act(() => fireEvent.click(cancelBt));
        await waitFor(() => {
            expect(screen.getByLabelText(/nome/i).value).not.toEqual("NewShelfName");
            expect(screen.getByLabelText(/dimensione.*bin.*/i).value).not.toEqual("5");
            expect(screen.getByLabelText(/larghezza/i).value).not.toEqual("8");
            expect(screen.getByLabelText(/altezza/i).value).not.toEqual("10");
        });
    });

    test("ShelfManager should call action removeShelf with correct id on cancel (step 1)", async () => {
        mockData = {
            errorMsg: null,
            setMovingShelf: jest.fn(),
            selectShelf: jest.fn(),
            updateShelfPosition: jest.fn(),
            addShelf: jest.fn(),
            removeShelf: jest.fn(),
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
            }] 
        };

        render(<ShelfManager config={true} setConfig={setConfig} />);

        const nameInput = screen.getByLabelText(/nome/i);     
        const submitBt = screen.getByText(/vai al posizionamento/i);

        await userEvent.type(nameInput, "NewShelfName");
        
        act(() => fireEvent.click(submitBt));

        await waitFor(() => {expect(screen.getByText("Aggiungi", {exact: true})).toBeInTheDocument();});

        const cancelBt = screen.getByText(/annulla/i);
        
        act(() => fireEvent.click(cancelBt));
        await waitFor(() => expect(mockData.removeShelf).toBeCalled());
    });

    test('ShelfManager should close ShelfConfigurator when clicked on cancel button', async () => {
        mockData = {
            setMovingShelf: jest.fn(),
            updateShelfPosition: jest.fn()
        };

        render(<ShelfManager config={true} setConfig={setConfig}/>);

        const cancelBt = screen.getByText(/annulla/i);
        
        act(() => fireEvent.click(cancelBt));
        await waitFor(() => expect(setConfig).toHaveBeenCalledWith(false));
    });
});

describe("ShelfCard management", () => {
    test("ShelfManager should call setConfig with parameter true on shelf edit click", async () => {
        mockData = {
            removeShelf: jest.fn(),
            selectedShelf: "firstShelfID",
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
            }],
            selectShelf: jest.fn()
        };

        render(<ShelfManager config={false} setConfig={setConfig} />);

        const editBt = screen.getByTestId("ShelfEditButton");
        
        fireEvent.click(editBt);
        await waitFor(() => {expect(setConfig).toHaveBeenCalledWith(true);});
    });

    test("ShelfManager should call action removeShelf with correct shelfId on shelf delete click", async () => {
        mockData = {
            removeShelf: jest.fn(),
            selectedShelf: "firstShelfID",
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
            }],
            selectShelf: jest.fn()
        };

        render(<ShelfManager config={false} setConfig={setConfig} />);

        const deleteBt = screen.getByTestId("ShelfDeleteButton");
        
        fireEvent.click(deleteBt);
        await waitFor(() => {expect(mockData.removeShelf).toHaveBeenCalledWith("firstShelfID");});
    });

    test("ShelfManager should call action selectShelf with no parmeters to deselect on shelf delete click", async () => {
        mockData = {
            removeShelf: jest.fn(),
            selectedShelf: "firstShelfID",
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
            }],
            selectShelf: jest.fn()
        };

        render(<ShelfManager config={false} setConfig={setConfig} />);

        const deleteBt = screen.getByTestId("ShelfDeleteButton");
        
        fireEvent.click(deleteBt);
        await waitFor(() => {expect(mockData.selectShelf).toHaveBeenCalledWith();});
    });

    test("ShelfManager should call action selectShelf with no parmeters to deselect on ShelfCard close", async () => {
        mockData = {
            selectedShelf: "firstShelfID",
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
            }],
            selectShelf: jest.fn()
        };

        render(<ShelfManager config={false} setConfig={setConfig} />);

        const closeBt = screen.getByRole("img", {name: "close"});
        
        fireEvent.click(closeBt);
        await waitFor(() => {expect(mockData.selectShelf).toHaveBeenCalledWith();});
    });
});

describe("Errors management", () => {
    test("Error cancel should clear error", async () => {
        mockData = {
            errorMsg: "Oops... something occurred",
            clearError: jest.fn()
        };

        render(<ShelfManager config={true} setConfig={setConfig} />);

        const closeBtn = screen.getByLabelText("Close");
        
        fireEvent.click(closeBtn);
        await waitFor(() => {expect(mockData.clearError).toBeCalledTimes(1);});
    });
});
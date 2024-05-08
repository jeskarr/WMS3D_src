import ProductManager from "@_components/actions/ProductManager";
import { render, screen, fireEvent, waitFor, act } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import userEvent from "../../../node_modules/@testing-library/user-event";
import "@__mocks__/matchMedia.mock";
import { ColorPickerUtils } from "./ColorPickerUtils";

const setConfig = jest.fn();
const configMove = jest.fn();
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

// TEST DI INTEGRAZIONE: ProductManager + (ProductCard, BinCard, ProductConfigurator, ErrorModal)
describe('Adding/Editing a product', () => {
    test('ProductManager should pass correct parameter to action addProduct on submit new product from ProductConfigurator', async () => {
        let pName = null;
        let pColor = null;
        mockData = {
            addProduct: jest.fn().mockImplementation((name, color) => {
                pName = name;
                pColor = color;
            })
        };

        render(<ProductManager config={true} setConfig={setConfig} configMove={configMove}/>);

        const submitBt = screen.getByText("Aggiungi", {exact: true});
        const nameInput = screen.getByLabelText(/nome/i);
        const colorInput = screen.getByTestId("ProductColorPicker");

        await userEvent.type(nameInput, "myNewProduct");
        ColorPickerUtils.setColor(colorInput, "501EC8");
        
        fireEvent.click(submitBt);
        await waitFor(() => {expect(pName).toEqual("myNewProduct");});
        await waitFor(() => {expect(pColor).toEqual({r: 80, g: 30, b: 200});});
    });

    test('ProductManager should call setConfig on submit new data for an existing product from ProductConfigurator', async () => {
        mockData = {
            updateName: jest.fn(),
            updateColor: jest.fn(),
            selectedProduct: "00-blueProd",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                },
                {
                    name: "greenProduct",
                    color: {r: 0, g: 255, b: 0},
                    id: "00-greenProd"
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [{
                    shelfName: "firstShelf",
                    binId: "firstShelf+3+5"
                },
                {
                    shelfName: "secondShelf",
                    binId: "secondShelf+2+0"
                }];
            })
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        act(() => fireEvent.click(screen.getByTestId("ProductEditButton")));
        await waitFor(() => {expect(setConfig).toBeCalledTimes(1)});
    });
    
    test('ProductManager should call actions updateName and updateColor on submit new data for an existing product from ProductConfigurator', async () => {
        let config = false;
        let setConfig = jest.fn((value) => {config = value}); 
        mockData = {
            updateName: jest.fn(),
            updateColor: jest.fn(),
            selectedProduct: "00-blueProd",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                },
                {
                    name: "greenProduct",
                    color: {r: 0, g: 255, b: 0},
                    id: "00-greenProd"
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [{
                    shelfName: "firstShelf",
                    binId: "firstShelf+3+5"
                },
                {
                    shelfName: "secondShelf",
                    binId: "secondShelf+2+0"
                }];
            })
        };

        const {rerender} = render(<ProductManager config={config} setConfig={setConfig} configMove={configMove}/>);

        act(() => fireEvent.click(screen.getByTestId("ProductEditButton")));
        await waitFor(() => {expect(config).toEqual(true)});

        rerender(<ProductManager config={config} setConfig={setConfig} configMove={configMove}/>);
        
        const submitBt = await screen.findByText("Modifica", {exact: true});
           
        fireEvent.click(submitBt);
        await waitFor(() => {expect(mockData.updateName).toHaveBeenCalledWith("00-blueProd", "blueProduct");});
        await waitFor(() => {expect(mockData.updateColor).toHaveBeenCalledWith("00-blueProd", {r: 0, g: 0, b: 255});});
    });

    test('ProductManager should close ProductConfigurator when clicked on config product submit', async () => {
        mockData = {
            addProduct: jest.fn(),
            errorMsg: null
        };

        render(<ProductManager config={true} setConfig={setConfig} configMove={configMove}/>);

        const submitBt = screen.getByText("Aggiungi", {exact: true});
        const nameInput = screen.getByLabelText(/nome/i);

        await userEvent.type(nameInput, "anotherNewProduct");
        
        act(() => fireEvent.click(submitBt));
        await waitFor(() => expect(setConfig).toHaveBeenCalledWith(false));
    });

    test('ProductManager should close ProductConfigurator when clicked on cancel button', async () => {
        mockData = {};
        render(<ProductManager config={true} setConfig={setConfig} configMove={configMove}/>);

        const cancelBt = screen.getByText("Annulla", {exact: true});
        const nameInput = screen.getByLabelText(/nome/i);
        const colorInput = screen.getByTestId("ProductColorPicker");

        await userEvent.type(nameInput, "myNewProduct");
        ColorPickerUtils.setColor(colorInput, "501EC8");
        
        act(() => fireEvent.click(cancelBt));
        await waitFor(() => expect(setConfig).toHaveBeenCalledWith(false));
    });

    test('ProductManager should reset ProductConfigurator when clicked on config product submit', async () => {
        mockData = {
            addProduct: jest.fn(),
            errorMsg: null
        };

        render(<ProductManager config={true} setConfig={setConfig} configMove={configMove}/>);

        const submitBt = screen.getByText("Aggiungi", {exact: true});
        const nameInput = screen.getByLabelText(/nome/i);
        const colorInput = screen.getByTestId("ProductColorPicker");

        await userEvent.type(nameInput, "myNewProduct");
        ColorPickerUtils.setColor(colorInput, "501EC8");
        
        act(() => fireEvent.click(submitBt));
        await waitFor(() => {expect(screen.getByLabelText(/nome/i)).not.toEqual("myNewProduct");});
        await waitFor(() => {expect(ColorPickerUtils.getColor(colorInput)).not.toEqual("rgb(80,30,200)");});
    });

    test('ProductManager should reset ProductConfigurator when clicked on cancel button', async () => {
        mockData = {};
        render(<ProductManager config={true} setConfig={setConfig} configMove={configMove}/>);

        const cancelBt = screen.getByText("Annulla", {exact: true});
        const nameInput = screen.getByLabelText(/nome/i);
        const colorInput = screen.getByTestId("ProductColorPicker");

        await userEvent.type(nameInput, "myNewProduct");
        ColorPickerUtils.setColor(colorInput, "501EC8");
        
        act(() => fireEvent.click(cancelBt));
        await waitFor(() => {expect(nameInput).not.toEqual("myNewProduct");});
        await waitFor(() => {expect(ColorPickerUtils.getColor(colorInput)).not.toEqual("rgb(80,30,200)");});
    });
});

describe("ProductCard management", () => {
    test("ProductManager should call configMove with parmeter true on product position click", async () => {
        mockData = {
            selectedProduct: "00-blueProd",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [];
            })
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const positionBt = screen.getByTestId("ProductPositionButton");
        
        fireEvent.click(positionBt);
        await waitFor(() => {expect(configMove).toHaveBeenCalledWith(true);});
    });
    
    test("ProductManager should call action removeProduct with correct productId on product delete click", async () => {
        mockData = {
            selectedProduct: "00-blueProd",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                },
                {
                    name: "redProduct",
                    color: {r: 255, g: 0, b: 0},
                    id: "01-redProd"
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [];
            }),
            removeProduct: jest.fn(),
            selectProduct: jest.fn()
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const deleteBt = screen.getByTestId("ProductDeleteButton");
        
        fireEvent.click(deleteBt);
        await waitFor(() => {expect(mockData.removeProduct).toHaveBeenCalledWith("00-blueProd");});
    });

    test("ProductManager should call action selectProduct with no parmeters to deselect on product delete click", async () => {
        mockData = {
            selectedProduct: "00-blueProd",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                },
                {
                    name: "redProduct",
                    color: {r: 255, g: 0, b: 0},
                    id: "01-redProd"
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [];
            }),
            removeProduct: jest.fn(),
            selectProduct: jest.fn()
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const deleteBt = screen.getByTestId("ProductDeleteButton");
        
        fireEvent.click(deleteBt);
        await waitFor(() => {expect(mockData.selectProduct).toHaveBeenCalledWith();});
    });

    test("ProductManager should call action selectProduct with no parmeters to deselect on ProductCard close", async () => {
        mockData = {
            selectedProduct: "00-blueProd",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                },
                {
                    name: "redProduct",
                    color: {r: 255, g: 0, b: 0},
                    id: "01-redProd"
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [];
            }),
            removeProduct: jest.fn(),
            selectProduct: jest.fn()
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const closeBt = screen.getByRole("img", {name: "close"});
        
        fireEvent.click(closeBt);
        await waitFor(() => {expect(mockData.selectProduct).toHaveBeenCalledWith();});
    });
});

describe("BinCard management", () => {
    test("ProductManager should call action selectBin with correct binId on bin click in ProductCard", async () => {
        mockData = {
            selectedProduct: "00-blueProd",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [{
                    shelfName: "firstShelf",
                    binId: "firstShelf+3+5"
                }];
            }),
            selectBin: jest.fn()
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const binBt = screen.getByText("firstShelf");
        
        fireEvent.click(binBt);
        await waitFor(() => {expect(mockData.selectBin).toHaveBeenCalledWith("firstShelf+3+5");});
    });

    test('ProductManager should call configMove with true parameter on product move click', async () => { 
        mockData = {
            selectedBin: "firstShelf+0+0",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                }
            ],
            shelves: [
                {
                    id: "firstShelf",
                    bins: [
                        [
                            { productId: "00-blueProd" }
                        ]
                    ]
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [{
                    shelfName: "firstShelf",
                    binId: "firstShelf+0+0"
                }];
            })
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const moveBt = screen.getByTestId("MoveProductButton");
        
        fireEvent.click(moveBt);
        await waitFor(() => {expect(configMove).toHaveBeenCalledWith(true);});
    });

    test('ProductManager should call removeProductFromBin with correct parameters on product remove click', async () => { 
        mockData = {
            selectedBin: "firstShelf+0+0",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                }
            ],
            shelves: [
                {
                    id: "firstShelf",
                    bins: [
                        [
                            { productId: "00-blueProd" }
                        ]
                    ]
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [{
                    shelfName: "firstShelf",
                    binId: "firstShelf+0+0"
                }];
            }),
            removeProductFromBin: jest.fn(),
            selectBin: jest.fn()
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const removeBt = screen.getByTestId("RemoveProductButton");
        
        fireEvent.click(removeBt);
        await waitFor(() => {expect(mockData.removeProductFromBin).toHaveBeenCalledWith("firstShelf","0","0");});
    });

    test('ProductManager should call selectBin with no parameters on product remove click', async () => { 
        mockData = {
            selectedBin: "firstShelf+0+0",
            products: [
                {
                    name: "blueProduct",
                    color: {r: 0, g: 0, b: 255},
                    id: "00-blueProd"
                }
            ],
            shelves: [
                {
                    id: "firstShelf",
                    bins: [
                        [
                            { productId: "00-blueProd" }
                        ]
                    ]
                }
            ],
            getBinsWithProduct: jest.fn().mockImplementation(() => {
                return [{
                    shelfName: "firstShelf",
                    binId: "firstShelf+0+0"
                }];
            }),
            removeProductFromBin: jest.fn(),
            selectBin: jest.fn()
        };

        render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);

        const removeBt = screen.getByTestId("RemoveProductButton");
        
        fireEvent.click(removeBt);
        await waitFor(() => {expect(mockData.selectBin).toHaveBeenCalledWith();});
    });

    test("ProductManager should call action selectBin with no parmeters to deselect on BinCard close", async () => {
            mockData = {
                selectedBin: "firstShelf+0+0",
                products: [
                    {
                        name: "blueProduct",
                        color: {r: 0, g: 0, b: 255},
                        id: "00-blueProd"
                    }
                ],
                shelves: [
                    {
                        id: "firstShelf",
                        bins: [
                            [
                                { productId: "00-blueProd" }
                            ]
                        ]
                    }
                ],
                getBinsWithProduct: jest.fn().mockImplementation(() => {
                    return [{
                        shelfName: "firstShelf",
                        binId: "firstShelf+0+0"
                    }];
                }),
                selectBin: jest.fn()
            };
    
            render(<ProductManager config={false} setConfig={setConfig} configMove={configMove}/>);
    
            const closeBt = screen.getByRole("img", {name: "close"});
            
            fireEvent.click(closeBt);
            await waitFor(() => {expect(mockData.selectBin).toHaveBeenCalledWith();});
        });
});

describe("Errors management", () => {
    test("Error cancel should clear error", async () => {
        mockData = {
            errorMsg: "Oops... something occurred",
            clearError: jest.fn()
        };

        render(<ProductManager config={true} setConfig={setConfig} configMove={configMove}/>);

        const closeBtn = screen.getByLabelText("Close");
        
        fireEvent.click(closeBtn);
        await waitFor(() => {expect(mockData.clearError).toBeCalledTimes(1);});
    });
});
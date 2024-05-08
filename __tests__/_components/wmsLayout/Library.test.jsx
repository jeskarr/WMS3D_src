import Library from "@_components/wmsLayout/Library";
import Shelf from "@_model/Shelf";
import Product from "@_model/Product";
import { fireEvent, render, screen } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import userEvent from "../../../node_modules/@testing-library/user-event";

let selectedP = null;
const selectP = jest.fn((id) => {selectedP = id});
let selectedS = null;
const selectS = jest.fn((id) => {console.log(id);selectedS = id});

// STORE MOCK
import { boundStore } from "../../../_lib/boundStore";
jest.mock('../../../_lib/boundStore');
beforeEach(() => {
    boundStore.mockImplementation((passedFunction) => { 
        const data = {
            shelves: [
                new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"),
                new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID")
            ],
            products: [
                new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProdID"),
                new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProdID")
            ],
            selectedProduct: selectedP,
            selectedShelf: selectedS,
            selectProduct: selectP,
            selectShelf: selectS
        }

        return passedFunction(data);
    });
});

describe("Components render", () => {
    test('Library should display shelves element', () => {
       render(<Library />);
       expect(screen.getByText(/scaffalature/i)).toBeInTheDocument();
    });

    test('Library should display shelves names', () => {
        render(<Library />);
        expect(screen.getByText(/firstShelf/i)).toBeInTheDocument();
        expect(screen.getByText(/secondShelf/i)).toBeInTheDocument();
    });

    test('Library should display products element', () => {
        render(<Library />); 
        expect(screen.getByText(/prodotti/i)).toBeInTheDocument();
    });

    test('Library should display products names', () => {
        render(<Library />);
        expect(screen.getByText(/firstProd/i)).toBeInTheDocument();
        expect(screen.getByText(/firstProd/i)).toBeInTheDocument();
    });

    test('Library should display search bar', () => {
        render(<Library />); 
        expect(screen.getByPlaceholderText(/cerca/i)).toBeInTheDocument();
    });
});

describe('Selection', () => {
    test('Library click on shelf name should call select shelf', () => {
        render(<Library />);
        let shelf = screen.getByTitle(/firstShelf/i);
        fireEvent.click(shelf); 
        expect(selectS).toBeCalledTimes(1);
    });

    test('Library click on shelf name should select shelf', () => {
        render(<Library />);
        let shelf = screen.getByTitle(/firstShelf/i);
        fireEvent.click(shelf); 
        expect(selectedS).toEqual('firstShelfID');
    });

    test('Library click on shelf name should call select product', () => {
        render(<Library />);
        let prod = screen.getByTitle(/secondProd/i);
        fireEvent.click(prod); 
        expect(selectP).toBeCalledTimes(1);
    });

    test('Library click on shelf name should select product', () => {
        render(<Library />);
        let prod = screen.getByTitle(/secondProd/i);
        fireEvent.click(prod); 
        expect(selectedP).toEqual('secondProdID');
    });
});

describe('Search', () => {
    test('Library search should show all results correctly', async () => {
        render(<Library />);
        let search = screen.getByPlaceholderText(/cerca/i);
        await userEvent.type(search, "first");
        expect(screen.getByText("firstShelf")).toBeInTheDocument();
        expect(screen.getByText("firstProd")).toBeInTheDocument();
    });

    test('Library search should not show non-corresponding names', async () => {
        render(<Library />);
        let search = screen.getByPlaceholderText(/cerca/i);
        await userEvent.type(search, "first");
        expect(screen.queryByText("secondShelf")).toBeNull();
        expect(screen.queryByText("secondProd")).toBeNull();
    });

    test('Library search should not show empty parent labels', async () => {
        render(<Library />);
        let search = screen.getByPlaceholderText(/cerca/i);
        await userEvent.type(search, "firstProd");
        expect(screen.queryByText(/scaffalature/i)).toBeNull();
    });
});
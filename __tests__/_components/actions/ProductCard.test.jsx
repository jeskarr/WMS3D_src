import ProductCard from "@_components/actions/ProductCard";
import { fireEvent, render, screen, within } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import "@__mocks__/matchMedia.mock"

const selectedProduct = {
    name: "firstProductName"
};

const binsWithProduct = [
    {
        shelfName: "firstShelf",
        binId: "firstShelf+3+5"
    },
    {
        shelfName: "secondShelf",
        binId: "secondShelf+2+0"
    }
];

const handleCloseProductCard = jest.fn();
const handleProductDelete = jest.fn();
const handleProductEdit = jest.fn();
const handleProductPositioning = jest.fn();
const handleBinSelection = jest.fn();

describe("Render product info", () => {
    test('ProductCard should render product name', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        expect(screen.getByText(selectedProduct.name, {exact: false})).toBeInTheDocument();
    });

    test('ProductCard should render all shelf info rows', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);

        const tableRows = screen.getAllByRole("row");
        expect(tableRows.length).toEqual(2);
    });

    test('ProductCard should render shelfNames and bins that contain the product', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);

        const tableRows = screen.getAllByRole("row");
        
        expect(within(tableRows[0]).getByText('firstShelf')).toBeInTheDocument();
        expect(within(tableRows[0]).getByText(/3.*5.*/)).toBeInTheDocument();
        expect(within(tableRows[1]).getByText('secondShelf')).toBeInTheDocument();
        expect(within(tableRows[1]).getByText(/2.*0.*/)).toBeInTheDocument();
    }); 
});

describe('Render interaction components', () => { 
    test('ProductCard should render product delete button', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        expect(screen.getByTestId("ProductDeleteButton")).toBeInTheDocument();
    });

    test('ProductCard should render product edit button', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        expect(screen.getByTestId("ProductEditButton")).toBeInTheDocument();
    });

    test('ProductCard should render product position button', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        expect(screen.getByTestId("ProductPositionButton")).toBeInTheDocument();
    });
});

describe("Interaction logic", () => {
    test('ProductCard should call handleProductDelete on delete button click', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        fireEvent.click(screen.getByTestId("ProductDeleteButton"));
        expect(handleProductDelete).toBeCalledTimes(1);
    });

    test('ProductCard should call handleProductEdit on edit button click', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        fireEvent.click(screen.getByTestId("ProductEditButton"));
        expect(handleProductEdit).toBeCalledTimes(1);
    });

    test('ProductCard should call handleProductPositioning on position button click', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        fireEvent.click(screen.getByTestId("ProductPositionButton"));
        expect(handleProductPositioning).toBeCalledTimes(1);
    });

    test('ProductCard should call handleBinSelection on row click with correct bin id', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        const tableRows = screen.getAllByRole("row");

        fireEvent.click(tableRows[1]);
        expect(handleBinSelection).toHaveBeenCalledWith("secondShelf+2+0");
    });

    test('ProductCard should sort shelf cells (ascending) based on name with one click', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        const shelfHeader = screen.getByText(/scaffalatura/i);
        fireEvent.click(shelfHeader);

        const tableRows = screen.getAllByRole("row");
        expect(within(tableRows[0]).getByText('firstShelf')).toBeInTheDocument();
        expect(within(tableRows[1]).getByText('secondShelf')).toBeInTheDocument();
    });

    test('ProductCard should sort shelf cells (descending) based on name with two clicks', () => { 
        render(<ProductCard selectedProduct={selectedProduct} binsWithProduct={binsWithProduct}
            handleProductDelete={handleProductDelete}
            handleProductEdit={handleProductEdit}
            handleProductPositioning={handleProductPositioning}
            handleBinSelection={handleBinSelection}
            handleCloseProductCard={handleCloseProductCard}
        />);
        const shelfHeader = screen.getByText(/scaffalatura/i);
        fireEvent.click(shelfHeader);
        fireEvent.click(shelfHeader);

        const tableRows = screen.getAllByRole("row");
        expect(within(tableRows[1]).getByText('firstShelf')).toBeInTheDocument();
        expect(within(tableRows[0]).getByText('secondShelf')).toBeInTheDocument();
    });
});
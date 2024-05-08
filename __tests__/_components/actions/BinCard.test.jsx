import BinCard from "@_components/actions/BinCard";
import { fireEvent, render, screen, waitFor } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";

const handleRemoveFromBin = jest.fn();
const handleProductMovement = jest.fn();
const handleCloseBinCard = jest.fn();
const selectedBin = {
    id: "Shelf+2+1",
    state: "STILL"
}
const selectedProduct = {
    name: "mySelectedProduct"
};

describe("Render bin info", () => {
    test('BinCard should render bin id', () => {
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);

        expect(screen.getByText(selectedBin.id, {exact: false})).toBeInTheDocument();
    });

    test('BinCard should render bin state', () => {
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);

        expect(screen.getByText(selectedBin.state, {exact: false})).toBeInTheDocument();
    });

    test('BinCard should render product inside bin', () => {
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);

        expect(screen.getByText(selectedProduct.name, {exact: false})).toBeInTheDocument();
    });

    test('BinCard should inform that there is no product if bin does not contain product', () => {
        const selectedProduct = null;

        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);

        expect(screen.getByText(/nessuno/i)).toBeInTheDocument();
    });
});

describe("Render interaction components", () => {
    test('BinCard should render product remove button', () => {
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);

        expect(screen.getByTestId("RemoveProductButton")).toBeInTheDocument();
    });

    test('BinCard should render move product button', () => {
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);

        expect(screen.getByTestId("MoveProductButton")).toBeInTheDocument();
    });
});

describe("Interaction logic", () => {
    test('BinCard should call handleRemoveFromBin on remove product click', () => {
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);
        fireEvent.click(screen.getByTestId("RemoveProductButton"));

        expect(handleRemoveFromBin).toBeCalledTimes(1);
    });

    test('BinCard should NOT call handleRemoveFromBin on remove product click if bin empty and it should show error', async () => {
        const selectedProduct = null;
        
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);
        fireEvent.click(screen.getByTestId("RemoveProductButton"));

        await waitFor(()=>{expect(handleRemoveFromBin).toBeCalledTimes(0)});
        await waitFor(()=>{expect(screen.queryByText(/nessun prodotto.*nel bin.*/i)).toBeInTheDocument()});      
    });    

    test('BinCard should call handleProductMovement on move product click', () => {
        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);
        fireEvent.click(screen.getByTestId("MoveProductButton"));

        expect(handleProductMovement).toBeCalledTimes(1);
    });

    test('BinCard should NOT call handleProductMovement on move product click if bin empty and it should show error', async () => {
        const selectedProduct = null;

        render(<BinCard selectedBin={selectedBin} selectedProduct={selectedProduct}
            handleCloseBinCard={handleCloseBinCard}
            handleRemoveFromBin={handleRemoveFromBin}
            handleProductMovement={handleProductMovement}
        />);
        fireEvent.click(screen.getByTestId("MoveProductButton"));

        await waitFor(()=>{expect(handleProductMovement).toBeCalledTimes(0)});
        await waitFor(()=>{expect(screen.queryByText(/impossibile.*movimentazione.*nessun prodotto.*nel bin.*/i)).toBeInTheDocument()});
    });
});
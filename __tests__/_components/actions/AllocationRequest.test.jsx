import AllocationRequest from "@_components/actions/AllocationRequest";
import { fireEvent, render, screen, waitFor, act } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import "@__mocks__/matchMedia.mock";
import userEvent from '../../../node_modules/@testing-library/user-event';

const formRef = {
    current: null,
}

const onFinishedConfig = jest.fn(); 
const shelves = [
    {
        name: "Shelf 1",
        id: 1,
        height: 3,
        width: 5
    },
    {
        name: "Shelf 2",
        id: 2,
        height: 4,
        width: 6
    }
];
const selectedProduct = {
    name: "mySelectedProduct"
};
const selectedBin = "Shelf+2+1";
const open = true;
const closeDrawer = jest.fn();

describe("Component setup", () => {
    test('AllocationRequest should render the Product name when a product is selected', () => { 
        render(<AllocationRequest 
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            shelves={shelves}
            selectedProduct={selectedProduct}
            selectedBin={null}
            open={open}
            closeDrawer={closeDrawer}
        />);
        expect(screen.getByText(selectedProduct.name, {exact: false})).toBeInTheDocument();
    });

    test('AllocationRequest should render "Posiziona" button when a product is selected', () => {
        render(<AllocationRequest 
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            shelves={shelves}
            selectedProduct={selectedProduct}
            selectedBin={null}
            open={open}
            closeDrawer={closeDrawer}
        />);
        
        const submitButton = screen.getByTestId("submitBtn");

        expect(submitButton).toHaveTextContent('Posiziona');
    });

    test('AllocationRequest should render "Sposta prodotto" when a full bin is selected', () => { 
        render(<AllocationRequest formRef={formRef} onFinishedConfig={onFinishedConfig} shelves={shelves}
            selectedProduct={null} selectedBin={selectedBin} open={open} closeDrawer={closeDrawer}
        />);
        expect(screen.getByText(/Sposta prodotto/i, {exact: false})).toBeInTheDocument();
    });

    test('AllocationRequest should render "Richiedi" button when a bin is selected', () => {
        render(<AllocationRequest 
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            shelves={shelves}
            selectedProduct={null}
            selectedBin={selectedBin}
            open={open}
            closeDrawer={closeDrawer}
        />);

        
        const submitButton = screen.getByTestId("submitBtn");

        expect(submitButton).toHaveTextContent(/Richiedi/i);
    });

    test('AllocationRequest should render the origin bins name when a product is selected', () => {
        render(<AllocationRequest 
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            shelves={shelves}
            selectedProduct={null}
            selectedBin={selectedBin}
            open={open}
            closeDrawer={closeDrawer}
        />);
        expect(screen.getByText(selectedBin, {exact: false})).toBeInTheDocument();
    });

});

describe("Input logic", () => {
    test('AllocationRequest should change rows and cols when shelf is selected', async () => {
        render(<AllocationRequest 
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            shelves={shelves}
            selectedProduct={selectedProduct}
            selectedBin={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const selectedSelects = screen.getAllByRole("combobox");
        const destinationShelfSelect = selectedSelects[0];
        const rowSelect = selectedSelects[1];
        const colSelect = selectedSelects[2];

        await userEvent.click(destinationShelfSelect);
        await waitFor(() => screen.getByText('Shelf 1', {exact: false}));
        fireEvent.click(screen.getByText('Shelf 1', {exact: false}));

        await userEvent.click(rowSelect);
        expect(screen.getByText('r0', {exact: false})).toBeInTheDocument();
        await userEvent.click(colSelect);
        expect(screen.getByText('c0', {exact: false})).toBeInTheDocument();
    });

    test('AllocationRequest should call onFinishedConfig when form is filled and submitted', async () => {
        render(<AllocationRequest 
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            shelves={shelves}
            selectedProduct={selectedProduct}
            selectedBin={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const selectedSelects = screen.getAllByRole("combobox");
        const destinationShelfSelect = selectedSelects[0];
        const rowSelect = selectedSelects[1];
        const colSelect = selectedSelects[2];
        const submitButton = screen.getByTestId("submitBtn");

        await userEvent.click(destinationShelfSelect);
        await waitFor(() => screen.getByText('Shelf 1', {exact: false}));
        fireEvent.click(screen.getByText('Shelf 1', {exact: false}));

        await userEvent.click(rowSelect);
        await waitFor(() => screen.getByText('r0', {exact: false}));
        fireEvent.click(screen.getByText('r0', {exact: false}));

        await userEvent.click(colSelect);
        await waitFor(() => screen.getByText('c0', {exact: false}));
        fireEvent.click(screen.getByText('c0', {exact: false}));

        // Submit form
        act(() => fireEvent.click(submitButton));

        // Check if onFinishedConfig is called
        await waitFor(() => {expect(onFinishedConfig).toBeCalledTimes(1)});
    });

    test('AllocationRequest shouldn`t call call onFinishedConfig when form is not filled and submitted', async () => {
        render(<AllocationRequest 
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            shelves={shelves}
            selectedProduct={selectedProduct}
            selectedBin={null}
            open={open}
            closeDrawer={closeDrawer}
        />);
        
        const submitButton = screen.getByTestId("submitBtn");
        // Submit form
        userEvent.click(submitButton);
    
        // Check if onFinishedConfig is called
        await waitFor(() => expect(onFinishedConfig).not.toBeCalled());
    });

    test('AllocationRequest should filter options correctly when input is provided', async () => { 
        render(<AllocationRequest  
            formRef={formRef} 
            onFinishedConfig={onFinishedConfig} 
            shelves={shelves} 
            selectedProduct={selectedProduct} 
            selectedBin={null} 
            open={open} 
            closeDrawer={closeDrawer} 
        />); 
 
        const selectedSelects = screen.getAllByRole("combobox"); 
        const destinationShelfSelect = selectedSelects[0]; 
        
        // Simulate user input
        fireEvent.change(destinationShelfSelect, {target: {value: "Shelf 1"}})
 
        // Check if options are filtered correctly 
        await waitFor(() => {
            expect(screen.getByText('Shelf 1', {exact: false})).toBeInTheDocument();
            expect(screen.queryByText('Shelf 2', {exact: false})).not.toBeInTheDocument();
        });
    });
});
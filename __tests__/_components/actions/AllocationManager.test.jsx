import AllocationManager from "@_components/actions/AllocationManager";
import { render, screen, fireEvent, waitFor, act } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import userEvent from '../../../node_modules/@testing-library/user-event';
import "@__mocks__/matchMedia.mock";

const config = true;
const setConfig = jest.fn();
let mockData = {};

// Mocking the Bound Store
import { boundStore } from "../../../_lib/boundStore";
jest.mock('../../../_lib/boundStore');
beforeEach(() => {
    boundStore.mockImplementation((passedFunction) => {
        const data = mockData;
        return passedFunction(mockData);
    });
});

describe("Moving/placing a product", () => {
    test('AllocationManager should call action insertProduct when a product is inserted into a bin', async () => {
        mockData = {
            shelves: [
                {
                    name: "Shelf 1",
                    id: 1,
                    height: 3,
                    width: 5
                }
            ],
            products: [
                {
                    name: "mySelectedProduct",
                    id: 1
                }
            ],
            selectedBin: null,
            selectedProduct: 1,
            insertProduct: jest.fn()
        };

        render(<AllocationManager config = {config} setConfig = {setConfig} />);

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

            await waitFor(() => {expect(mockData.insertProduct).toBeCalledTimes(1)});
    });

    test('AllocationManager should call action orderMovementFromSelected when a product is inserted into a bin', async () => {
        mockData = {
            formRef: {current: {resetFields: jest.fn()}},
            shelves: [
                {
                    name: "Shelf 1",
                    id: 1,
                    height: 3,
                    width: 5
                }
            ],
            selectedBin: "bin1",
            selectedProduct: null,
            orderMovementFromSelected: jest.fn(),
        };

        render(<AllocationManager config = {config} setConfig = {setConfig} />);

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

            await waitFor(() => {expect(mockData.orderMovementFromSelected).toBeCalledTimes(1)});
    });

    test('AllocationManager should call handleCloseRequest when a product successfully moved', async () => {
        mockData = {
            formRef: {current: {resetFields: jest.fn()}},
            shelves: [
                {
                    name: "Shelf 1",
                    id: 1,
                    height: 3,
                    width: 5
                }
            ],
            selectedBin: "bin1",
            selectedProduct: null,
            errorMsg: null,
            orderMovementFromSelected: jest.fn(),
        };

        render(<AllocationManager config = {config} setConfig = {setConfig} />);

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

            await waitFor(() => {expect(setConfig).toHaveBeenCalledWith(false)});
    });

    test('AllocationManager should call handleCloseRequest when a product successfully placed', async () => {
        mockData = {
            formRef: {current: {resetFields: jest.fn()}},
            shelves: [
                {
                    name: "Shelf 1",
                    id: 1,
                    height: 3,
                    width: 5
                }
            ],
            products: [
                {
                    name: "mySelectedProduct",
                    id: 1
                }
            ],
            selectedBin: null,
            selectedProduct: 1,
            errorMsg: null,
            insertProduct: jest.fn(),
        };

        render(<AllocationManager config = {config} setConfig = {setConfig} />);

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

            await waitFor(() => {expect(setConfig).toHaveBeenCalledWith(false)});
    });

    test('AllocationManager should pass the correct parameters to insertProduct on submit of a new movement', async () => {
        let sProd = null;
        let dShelf = null;
        let dRow = null;
        let dCol = null;
        mockData = {
            insertProduct: jest.fn().mockImplementation((selectedProduct, destinationShelf, destinationBinRow, destinationBinCol) => {
                sProd = selectedProduct;
                dShelf = destinationShelf;
                dRow = destinationBinRow;
                dCol = destinationBinCol;
            }),
            shelves: [
                {
                    name: "Shelf 1",
                    id: 1,
                    height: 3,
                    width: 5
                }
            ],
            products: [
                {
                    name: "mySelectedProduct",
                    id: 1
                }
            ],
            selectedBin: null,
            selectedProduct: 1
        };

        render(<AllocationManager config = {config} setConfig = {setConfig} />);

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

            await waitFor(() => {expect(sProd).toEqual(1);});
            await waitFor(() => {expect(dShelf).toEqual(1);});
            await waitFor(() => {expect(dRow).toEqual(0);});
            await waitFor(() => {expect(dCol).toEqual(0);});
    });

    test('AllocationManager should pass the correct parameters to orderMovementFromSelected on submit of a movement from a bin', async () => {
        let dShelf = null;
        let dRow = null;
        let dCol = null;
        mockData = {
            orderMovementFromSelected: jest.fn().mockImplementation(( destinationShelf, destinationBinRow, destinationBinCol) => {
                dShelf = destinationShelf;
                dRow = destinationBinRow;
                dCol = destinationBinCol;
            }),
            shelves: [
                {
                    name: "Shelf 1",
                    id: 1,
                    height: 3,
                    width: 5
                }
            ],
            selectedBin: "bin1",
            selectedProduct: null
        };

        render(<AllocationManager config = {config} setConfig = {setConfig} />);

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

        await waitFor(() => {expect(dShelf).toEqual(1);});
        await waitFor(() => {expect(dRow).toEqual(0);});
        await waitFor(() => {expect(dCol).toEqual(0);});
    });

    test('AllocationManager should reset AllocationRequest fields when clicked on cancel button', async () => {
        mockData = {shelves: [ { name: "Shelf 1", id: 1, height: 3, width: 5 } ], selectedBin: "bin1", selectedProduct: null};
        render(<AllocationManager config={config} setConfig={setConfig} />);

        const cancelBt = screen.getByText("Annulla", {exact: true});
        const selectedSelects = screen.getAllByRole("combobox");
        const destinationShelfSelect = selectedSelects[0];

        await userEvent.click(destinationShelfSelect);
        await waitFor(() => screen.getByText('Shelf 1', {exact: false}));
        fireEvent.click(screen.getByText('Shelf 1', {exact: false}));
        
        act(() => fireEvent.click(cancelBt));
        await waitFor(() => {expect(destinationShelfSelect).not.toEqual("Shelf 1");});
    });
});

describe("Error handling", () => {
    test('AllocationManager should call clearError when error modal is closed', async () => {
        mockData = {
            shelves: [],
            errorMsg: "Error",
            clearError: jest.fn(),
        };

        render(<AllocationManager config = {config} setConfig = {setConfig} />);

        const closeBtn = screen.getByLabelText("Close");
            
        act(() => fireEvent.click(closeBtn));

        await waitFor(() => {expect(mockData.clearError).toBeCalledTimes(1)});
    });     
});
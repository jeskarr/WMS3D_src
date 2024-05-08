import ShelfConfigurator from "@_components/actions/ShelfConfigurator";
import { fireEvent, render, screen, waitFor, act } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import "@__mocks__/matchMedia.mock";
import userEvent from '../../../node_modules/@testing-library/user-event';

const formRef = {
    current: null
};
const current = 0;
const onFinishedConfig = jest.fn();
const onShelfPosition = jest.fn();
const modShelf = {
    name: "ShelfName",
    binSize: 6,
    width: 5,
    height: 8
};
const open = true;
const closeDrawer = jest.fn();

describe("Component setup", () => {
    test('ShelfConfigurator should render `Aggiungi scaffalatura` on step 0 when modShelf is empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText(/aggiungi scaffalatura/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render `Modifica scaffalatura` on step 0 when modShelf is NOT empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={modShelf}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText(/modifica scaffalatura/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render name input field on step 0', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render shelf name in name input field on step 0 if modShelf NOT empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={modShelf}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByLabelText(/nome/i)).toHaveValue(modShelf.name);
    });

    test('ShelfConfigurator should render binSize input field on step 0', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByLabelText(/dimensione.*bin.*/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render shelf binSize in binSize input field on step 0 if modShelf NOT empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={modShelf}
            open={open}
            closeDrawer={closeDrawer}
        />);
        
        const binSize = Number(screen.getByLabelText(/dimensione.*bin.*/i).value);
        expect(binSize).toEqual(modShelf.binSize);
    });

    test('ShelfConfigurator should render width input field on step 0', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByLabelText(/larghezza/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render shelf width in width input field on step 0 if modShelf NOT empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={modShelf}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const width = Number(screen.getByLabelText(/larghezza/i).value);
        expect(width).toEqual(modShelf.width);
    });

    test('ShelfConfigurator should render height input field on step 0', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByLabelText(/altezza/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render shelf height in height input field on step 0 if modShelf NOT empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={modShelf}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const height = Number(screen.getByLabelText(/altezza/i).value);
        expect(height).toEqual(modShelf.height);
    });

    test('ShelfConfigurator should render position button on step 0', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText(/vai al posizionamento/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render controls message on step 1', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={1}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText(/usa i controlli.*render 3d.*per posizionare la scaffalatura.*/i)).toBeInTheDocument();
    });

    test('ShelfConfigurator should render add button on step 1 if modShelf is empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={1}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText("Aggiungi", {exact: true})).toBeInTheDocument();
    });

    test('ShelfConfigurator should render modify button on step 1 if modShelf is NOT empty', () => { 
        render(<ShelfConfigurator
            formRef={formRef}
            current={1}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={modShelf}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText("Modifica", {exact: true})).toBeInTheDocument();
    });
});

describe('Input logic', () => {
    test('ShelfConfigurator should call onFinishedConfig on submit when all parameters are input in step 0', async () => {
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

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
        await waitFor(() => {expect(onFinishedConfig).toBeCalledTimes(1)});
    });

    test('ShelfConfigurator should call onFinishedConfig with correct parameters on submit when all parameters are input in step 0', async () => {
        let values = null;
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={jest.fn().mockImplementation((params) => {values = params})}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

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
        await waitFor(() => {expect(values).not.toBeNull()});

        expect(values.shelfName).toEqual("NewShelfName");
        expect(values.binSize).toEqual(5);
        expect(values.shelfWidth).toEqual(8);
        expect(values.shelfHeight).toEqual(10);
    });

    test('ShelfConfigurator should call onShelfPosition on submit in step 1', async () => {
        render(<ShelfConfigurator
            formRef={formRef}
            current={1}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const submitBt = screen.getByText("Aggiungi", {exact: true});

        act(() => fireEvent.click(submitBt));
        await waitFor(() => {expect(onShelfPosition).toBeCalledTimes(1)});
    });

    test('ShelfConfigurator should show error on submit if name is missing', async () => {
        render(<ShelfConfigurator
            formRef={formRef}
            current={current}
            onFinishedConfig={onFinishedConfig}
            onShelfPosition={onShelfPosition}
            modShelf={null}
            open={open}
            closeDrawer={closeDrawer}
        />);
        
        const submitBt = screen.getByText(/vai al posizionamento/i);

        act(() => fireEvent.click(submitBt));
        await waitFor(() => {expect(screen.getByText(/inserire.*nome.*/i)).toBeInTheDocument()});
    });
});
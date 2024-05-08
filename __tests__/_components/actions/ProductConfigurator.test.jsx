import ProductConfigurator from "@_components/actions/ProductConfigurator";
import { fireEvent, render, screen, act, waitFor } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import userEvent from '../../../node_modules/@testing-library/user-event';
import "@__mocks__/matchMedia.mock";
import { ColorPickerUtils } from "./ColorPickerUtils";

const modProduct = {
    name: "myName",
    color: {
        r: 30,
        g: 20,
        b: 50
    }
};
const formRef = {
    current: null
};
const onFinishedConfig = jest.fn();
const open = true;
const closeDrawer = jest.fn();

describe('Component setup', () => { 
    test('ProductConfigurator should render `Aggiungi prodotto` when modProduct is empty', () => {
        render(<ProductConfigurator 
            modProduct={null}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText(/aggiungi prodotto/i)).toBeInTheDocument();
    });

    test('ProductConfigurator should render `Modifica prodotto` when modProduct is not empty', () => { 
        render(<ProductConfigurator 
            modProduct={modProduct}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);

        expect(screen.getByText(/modifica prodotto/i)).toBeInTheDocument();
    });

    test('ProductConfigurator should render product name input field', () => { 
        render(<ProductConfigurator 
            modProduct={modProduct}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const nameInput = screen.getByLabelText(/nome/i);

        expect(nameInput).toBeInTheDocument();
    });

    test('ProductConfigurator should render product name in field when modProduct is not empty', () => { 
        render(<ProductConfigurator 
            modProduct={modProduct}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const nameInput = screen.getByLabelText(/nome/i);

        expect(nameInput).toHaveValue(modProduct.name);
    });

    test('ProductConfigurator should render product color input field', () => { 
        render(<ProductConfigurator 
            modProduct={modProduct}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const colorInput = screen.getByTestId("ProductColorPicker");       

        expect(colorInput).toBeInTheDocument();
    });

    test('ProductConfigurator should render product color in field when modProduct is not empty', () => { 
        render(<ProductConfigurator 
            modProduct={modProduct}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);

        const colorInput = screen.getByTestId("ProductColorPicker");       

        expect(ColorPickerUtils.getColor(colorInput)).toEqual("rgb(30, 20, 50)");
    });
});

describe("Input logic", () => {
    test('ProductConfigurator should call onFinishedConfig on submit when all parameters are input', async () => {
        render(<ProductConfigurator 
            modProduct={null}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);
        
        const submitBt = screen.getByText("Aggiungi", {exact: true});
        const nameInput = screen.getByLabelText(/nome/i);
        const colorInput = screen.getByTestId("ProductColorPicker");

        await userEvent.type(nameInput, "myNewProduct");
        ColorPickerUtils.setColor(colorInput, "050928");
        
        fireEvent.click(submitBt);
        await waitFor(() => {expect(onFinishedConfig).toBeCalledTimes(1)});
    });

    test('ProductConfigurator should call onFinishedConfig with correct parameter values on submit when all parameters are input', async () => {
        let values = null;
        render(<ProductConfigurator 
            modProduct={null}
            formRef={formRef}
            onFinishedConfig={jest.fn().mockImplementation((params) => {values = params})}
            open={open}
            closeDrawer={closeDrawer}
        />);
        
        const submitBt = screen.getByText("Aggiungi", {exact: true});
        const nameInput = screen.getByLabelText(/nome/i);
        const colorInput = screen.getByTestId("ProductColorPicker");

        await userEvent.type(nameInput, "myNewProduct");
        ColorPickerUtils.setColor(colorInput, "ff0000");
        
        fireEvent.click(submitBt);
        await waitFor(() => {expect(values).not.toBeNull()});
        expect(values.productName).toEqual("myNewProduct");
        const {r, g, b} = values.productColor.metaColor;
        expect(r).toEqual(255);
        expect(g).toEqual(0);
        expect(b).toEqual(0);
    });

    test('ProductConfigurator should show error on submit if name is missing', async () => {
        render(<ProductConfigurator 
            modProduct={null}
            formRef={formRef}
            onFinishedConfig={onFinishedConfig}
            open={open}
            closeDrawer={closeDrawer}
        />);
        
        const submitBt = screen.getByText("Aggiungi", {exact: true});
        
        act(() => fireEvent.click(submitBt));
        await waitFor(() => {expect(screen.getByText(/inserire.*nome.*/i)).toBeInTheDocument()});
    });
});
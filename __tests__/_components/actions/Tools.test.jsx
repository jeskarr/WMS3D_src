import Tools from "@_components/actions/Tools";
import { render, screen, fireEvent } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";

const openShelfDrawer = jest.fn();
const openProductDrawer = jest.fn();
const openMovementView = jest.fn();

describe('Buttons render', () => {
    test('Tools should render movements list button', () => { 
        render(<Tools openShelfDrawer={openShelfDrawer} openProductDrawer={openProductDrawer} openMovementView={openMovementView}/>)
        
        const button = screen.getByTestId("OpenMovementViewBt");
        expect(button).toBeInTheDocument();
    });

    test('Tools should render add button', () => { 
        render(<Tools openShelfDrawer={openShelfDrawer} openProductDrawer={openProductDrawer} openMovementView={openMovementView}/>)
        
        const button = screen.getByTestId("OpenAddOptions");
        expect(button).toBeInTheDocument();
    });

    test('Tools should render add shelf button when clicked on add button', () => { 
        render(<Tools openShelfDrawer={openShelfDrawer} openProductDrawer={openProductDrawer} openMovementView={openMovementView}/>)
        const addButton = screen.getByTestId("OpenAddOptions");
        fireEvent.click(addButton);

        const addShelfButton = screen.getByTestId("ShelfAddBt");
        expect(addShelfButton).toBeInTheDocument();
    });

    test('Tools should render add product button when clicked on add button', () => { 
        render(<Tools openShelfDrawer={openShelfDrawer} openProductDrawer={openProductDrawer} openMovementView={openMovementView}/>)
        const addButton = screen.getByTestId("OpenAddOptions");
        fireEvent.click(addButton);

        const addProductButton = screen.getByTestId("ProductAddBt");
        expect(addProductButton).toBeInTheDocument();
    });
});

describe("Buttons logic", () => {
    test('Tools should call openMovementView when clicked on movements list button', () => { 
        render(<Tools openShelfDrawer={openShelfDrawer} openProductDrawer={openProductDrawer} openMovementView={openMovementView}/>)
        
        const button = screen.getByTestId("OpenMovementViewBt");
        fireEvent.click(button);

        expect(openMovementView).toBeCalledTimes(1);
    });

    test('Tools should call openShelfDrawer when clicked on add shelf button', () => { 
        render(<Tools openShelfDrawer={openShelfDrawer} openProductDrawer={openProductDrawer} openMovementView={openMovementView}/>)
        const addButton = screen.getByTestId("OpenAddOptions");
        fireEvent.click(addButton);

        const addShelfButton = screen.getByTestId("ShelfAddBt");
        fireEvent.click(addShelfButton);

        expect(openShelfDrawer).toBeCalledTimes(1);
    });

    test('Tools should call openProductDrawer when clicked on add product button', () => { 
        render(<Tools openProductDrawer={openProductDrawer} openShelfDrawer={openShelfDrawer} openMovementView={openMovementView}/>)
        const addButton = screen.getByTestId("OpenAddOptions");
        fireEvent.click(addButton);

        const addProductButton = screen.getByTestId("ProductAddBt");
        fireEvent.click(addProductButton);

        expect(openProductDrawer).toBeCalledTimes(1);
    });
});
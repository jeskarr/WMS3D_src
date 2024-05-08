import ShelfCard from "@_components/actions/ShelfCard";
import { fireEvent, render, screen } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";

const shelfInfo = {
    name: "MyFirstShelf",
    width: 6,
    height: 3,
    binSize: 4
}

const handleShelfDelete = jest.fn();
const handleShelfEdit = jest.fn();

describe("Render shelf info", () => {
    test('ShelfCard should render shelf name', () => { 
        render(<ShelfCard handleCloseCard={jest.fn()} handleShelfDelete={jest.fn()} handleShelfEdit={jest.fn()} selectedShelf={shelfInfo} />)
        expect(screen.getByText(shelfInfo.name, {exact: false})).toBeInTheDocument();
    });

    test('ShelfCard should render shelf dimensions', () => { 
        render(<ShelfCard handleCloseCard={jest.fn()} handleShelfDelete={jest.fn()} handleShelfEdit={jest.fn()} selectedShelf={shelfInfo} />)
        expect(screen.getByText(`${shelfInfo.width}x${shelfInfo.height}`, {exact: false})).toBeInTheDocument();
    });

    test('ShelfCard should render shelf binSize', () => { 
        render(<ShelfCard handleCloseCard={jest.fn()} handleShelfDelete={jest.fn()} handleShelfEdit={jest.fn()} selectedShelf={shelfInfo} />)
        expect(screen.getByText(`${shelfInfo.binSize}x${shelfInfo.binSize}x${shelfInfo.binSize}`, {exact: false})).toBeInTheDocument();
    });
});

describe("Render interaction components", () => {
    test('ShelfCard should render shelf delete button', () => { 
        render(<ShelfCard handleCloseCard={jest.fn()} handleShelfDelete={jest.fn()} handleShelfEdit={jest.fn()} selectedShelf={shelfInfo} />)
        expect(screen.getByTestId("ShelfDeleteButton")).toBeInTheDocument();
    });

    test('ShelfCard should render shelf edit button', () => { 
        render(<ShelfCard handleCloseCard={jest.fn()} handleShelfDelete={jest.fn()} handleShelfEdit={jest.fn()} selectedShelf={shelfInfo} />)
        expect(screen.getByTestId("ShelfEditButton")).toBeInTheDocument();
    });
});

describe('Interaction logic', () => { 
    test('ShelfCard should call handleShelfDelete on delete shelf click', () => { 
        render(<ShelfCard handleCloseCard={jest.fn()} handleShelfDelete={handleShelfDelete} handleShelfEdit={jest.fn()} selectedShelf={shelfInfo} />)
        
        const deleteButton = screen.getByTestId("ShelfDeleteButton");
        fireEvent.click(deleteButton);
        expect(handleShelfDelete).toBeCalledTimes(1);
    });

    test('ShelfCard should call handleShelfEdit on edit shelf click', () => { 
        render(<ShelfCard handleCloseCard={jest.fn()} handleShelfDelete={jest.fn()} handleShelfEdit={handleShelfEdit} selectedShelf={shelfInfo} />)
        
        const editButton = screen.getByTestId("ShelfEditButton");
        fireEvent.click(editButton);
        expect(handleShelfEdit).toBeCalledTimes(1);
    });
});
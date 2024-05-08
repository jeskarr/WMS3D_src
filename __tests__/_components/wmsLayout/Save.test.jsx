import Save from "@_components/wmsLayout/Save";
import { fireEvent, render, screen } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";

// STORE MOCK
import { boundStore } from "../../../_lib/boundStore";
jest.mock('../../../_lib/boundStore');
beforeEach(() => {
    boundStore.mockImplementation((passedFunction) => { 
        const data = {
            whsName: "myWms",
            stateToJson: jest.fn()
        }

        return passedFunction(data);
    });
});

describe('Components render', () => {
    test('Save should show wms name', () => { 
        render(<Save />);

        const button = screen.getByText(/myWms/i);

        expect(button).toBeInTheDocument();
    });
});

describe('Save logic', () => {
    global.URL.createObjectURL = jest.fn(() => {return "urlstring"});
    global.URL.revokeObjectURL = jest.fn();

    test('Save should download file when button clicked', () => {        
        const link = {
            click: jest.fn()
        };

        render(<Save />);

        jest.spyOn(document, 'createElement').mockReturnValueOnce(link);

        const button = screen.getByText(/myWms/i);

        fireEvent.click(button);          
      
        expect(link.download).toEqual("myWms.json");
        expect(link.href).toEqual("urlstring");
        expect(link.click).toHaveBeenCalledTimes(1);
    });

    test('Save should have default name', () => {
        boundStore.mockImplementation((passedFunction) => { 
            const data = {
                stateToJson: jest.fn()
            }
    
            return passedFunction(data);
        });

        const link = {
            click: jest.fn()
        };

        render(<Save />);

        jest.spyOn(document, 'createElement').mockReturnValueOnce(link);

        const button = screen.getByText(/salva/i);

        fireEvent.click(button);          
      
        expect(link.download).toEqual("data.json");
        expect(link.href).toEqual("urlstring");
        expect(link.click).toHaveBeenCalledTimes(1);
    });
});
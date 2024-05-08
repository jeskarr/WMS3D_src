import WhsSetupFromJson from "@_components/setup/WhsSetupFromJson";
import { render, screen, fireEvent, waitFor, act } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import userEvent from '../../../node_modules/@testing-library/user-event';
import "@__mocks__/matchMedia.mock"

describe('Inputs render', () => {
    test('WhsSetupFromJson should have JSON drag file input', () => {
        render(<WhsSetupFromJson loading={false} setLoading={null} setWarehouse={null} />);
        
        const input = screen.getByTestId('fileUpload');
        expect(input).toBeInTheDocument();
    });

    test('WhsSetupFromJson should have submit button', () => {    
        render(<WhsSetupFromJson loading={false} setLoading={null} setWarehouse={null} />);
        
        const submit = screen.getByText(/crea/i);
        expect(submit).toBeInTheDocument();
    });
});

describe('File input logic', () => {
    test('WhsSetupFromJson should not accept non-json files', async () => {
        render(<WhsSetupFromJson loading={false} setLoading={null} setWarehouse={null} />);
        const input = screen.getByTestId('fileUploadDragger');
        const file = new File(['foo'], 'foo.txt', {type: 'text/plain'});
        
        await userEvent.upload(input, file);
        await waitFor(() => expect(input.files.length).toBe(0));
    });
    
    test('WhsSetupFromJson should accept json files', async () => {
        render(<WhsSetupFromJson loading={false} setLoading={null} setWarehouse={null} />);
        const input = screen.getByTestId('fileUploadDragger'); 
        const file = new File(['foo'], 'foo.json', {type: 'application/json'});
    
        await userEvent.upload(input, file);    
        await waitFor(() => expect(input.files.length).toBe(1));
        await waitFor(() => expect(screen.getByText('foo.json')).toBeInTheDocument());
    });

    test('WhsSetupFromJson should show error for non-json type files', async () => {
        render(<WhsSetupFromJson loading={false} setLoading={null} setWarehouse={null} />);
        const input = screen.getByTestId('fileUploadDragger'); 
        const file = new File(['foo'], 'foo.json', {type: 'text/plain'});
    
        await userEvent.upload(input, file);
        let errorMsg = await screen.findByText(/.*solo.*json.*/i);
        await waitFor(() => expect(errorMsg).toBeInTheDocument());
    });
});

describe('Call to setWarehouse function if file is input', () => {
    test('WhsSetupFromJson should call setWarehouse function on submit if file is input', async () => {
        global.fetch = jest.fn((string, request)=>{
            return {
                json() {
                    return {
                        message: "OK",
                        err: false
                    }
                }            
            }
        });
        
        const setupFunction = jest.fn();
    
        render(<WhsSetupFromJson loading={false} setLoading={jest.fn()} setWarehouse={setupFunction} />);
        
        const input = screen.getByTestId('fileUploadDragger'); 
        const file = new File(['foo'], 'foo.json', {type: 'application/json'});
        await userEvent.upload(input, file);
        act(() => fireEvent.click(screen.getByText(/crea/i)));
    
        await waitFor(() => expect(setupFunction).toBeCalled());
    });

    test('WhsSetupFromJson should not call setWarehouse if file is missing', async () => {        
        const setupFunction = jest.fn();
    
        render(<WhsSetupFromJson loading={false} setLoading={jest.fn()} setWarehouse={setupFunction} />);
        
        const input = screen.getByTestId('fileUploadDragger'); 

        act(() => fireEvent.click(screen.getByText(/crea/i)));
    
        let errorMsg = await screen.findByText(/.*file.*non.*inserito.*/i);
        await waitFor(() => expect(errorMsg).toBeInTheDocument());
        await waitFor(() => expect(setupFunction).toBeCalledTimes(0));
    });

    test('WhsSetupFromJson should NOT call setWarehouse function on submit if json format is incorrect', async () => {
        global.fetch = jest.fn((string, request)=>{
            return {
                json() {
                    return {
                        message: "OK",
                        err: true
                    }
                }            
            }
        });
        
        const setupFunction = jest.fn();
    
        render(<WhsSetupFromJson loading={false} setLoading={jest.fn()} setWarehouse={setupFunction} />);
        
        const input = screen.getByTestId('fileUploadDragger'); 
        const file = new File(['foo'], 'foo.json', {type: 'application/json'});
        await userEvent.upload(input, file);
        act(() => fireEvent.click(screen.getByText(/crea/i)));
        
        let errorMsg = await screen.findByText(/formato.*non.*corretto/i);
        await waitFor(() => expect(errorMsg).toBeInTheDocument());
        await waitFor(() => expect(setupFunction).toBeCalledTimes(0));
    });
});
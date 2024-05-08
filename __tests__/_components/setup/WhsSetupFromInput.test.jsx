import WhsSetupFromInput from "@_components/setup/WhsSetupFromInput";
import { render, screen, fireEvent, waitFor, act } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import userEvent from '../../../node_modules/@testing-library/user-event';
import "@__mocks__/matchMedia.mock"

describe('Inputs render', () => {
    test('WhsSetupFromInput should have name input', () => {    
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        
        const name = screen.getByLabelText(/nome/i);
        const inputs = screen.getAllByRole('textbox');
        expect(inputs).toContainEqual(name);
    });
    
    test('WhsSetupFromInput should have height input', () => {    
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        
        const height = screen.getByLabelText(/altezza/i);
        const inputs = screen.getAllByRole('spinbutton');
        expect(inputs).toContainEqual(height);
    });
    
    test('WhsSetupFromInput should have width input', () => {    
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        
        const width = screen.getByLabelText(/larghezza/i);
        const inputs = screen.getAllByRole('spinbutton');
        expect(inputs).toContainEqual(width);
    });
    
    test('WhsSetupFromInput should have depth input', () => {    
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        
        const depth = screen.getByLabelText(/profondità/i);
        const inputs = screen.getAllByRole('spinbutton');
        expect(inputs).toContainEqual(depth);
    });
    
    test('WhsSetupFromInput should have svg file input', () => {    
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        
        const svg = screen.getByLabelText(/svg|file/i);
        expect(svg).toBeInTheDocument();
    });

    test('WhsSetupFromInput should have upload button', () => {    
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        
        const svg = screen.getByLabelText(/carica/i);
        expect(svg).toBeInTheDocument();
    });
});

describe('File input logic', () => {
    test('WhsSetupFromInput should not accept non-svg files', async () => {
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        const svgUploader = screen.getByLabelText(/svg|file/i); 
        const file = new File(['foo'], 'foo.txt', {type: 'text/plain'});
        
        await userEvent.upload(svgUploader, file);
        await waitFor(() => expect(svgUploader.files.length).toBe(0));
    });
    
    test('WhsSetupFromInput should accept svg files', async () => {
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        const svgUploader = screen.getByLabelText(/svg|file/i); 
        const file = new File(['foo'], 'foo.svg', {type: 'image/svg+xml'});
    
        await userEvent.upload(svgUploader, file);    
        await waitFor(() => expect(svgUploader.files.length).toBe(1));
        await waitFor(() => expect(screen.getByTitle('foo.svg')).toBeInTheDocument());
    });

    test('WhsSetupFromInput should show error for non-svg type files', async () => {
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        const svgUploader = screen.getByLabelText(/svg|file/i);
        const file = new File(['foo'], 'foo.svg', {type: 'text/plain'});
    
        await userEvent.upload(svgUploader, file);
        let errorMsg = await screen.findByText(/.*solo.*SVG.*/i);
        await waitFor(() => expect(errorMsg).toBeInTheDocument());
    });
    
    test('WhsSetupFromInput should disable width and length if svg loaded', async () => {
        render(<WhsSetupFromInput loading={false} setLoading={null} setWarehouse={null} />);
        const svgUploader = screen.getByLabelText(/svg|file/i); 
        const file = new File(['foo'], 'foo.svg', {type: 'image/svg+xml'});
        
        await userEvent.upload(svgUploader, file);
        
        const width = screen.getByLabelText(/larghezza/i);
        const depth = screen.getByLabelText(/profondità/i);
        await waitFor(() => expect(width).toBeDisabled());
        await waitFor(() => expect(depth).toBeDisabled());    
    });
});

describe('Call to setWarehouse function if all necessary parameters are input', () => {
    test('WhsSetupFromInput should call setWarehouse function on submit if name, height and file are input', async () => {
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
    
        render(<WhsSetupFromInput loading={false} setLoading={jest.fn()} setWarehouse={setupFunction} />);
        
        const svgUploader = screen.getByLabelText(/svg|file/i);
        const name = screen.getByLabelText(/nome/i);
        const height = screen.getByLabelText(/altezza/i);
    
        const file = new File(['hello'], 'hello.svg', {type: 'image/svg+xml'});
        await userEvent.upload(svgUploader, file);
    
        await userEvent.type(name, "myWhs");
        await userEvent.type(height, "20");
    
        act(() => fireEvent.click(screen.getByText(/crea/i)));
    
        await waitFor(() => expect(setupFunction).toBeCalled());
    });

    test('WhsSetupFromInput should call setWarehouse function on submit if name, height, depth and width are input', async () => {        
        const setupFunction = jest.fn();
    
        render(<WhsSetupFromInput loading={false} setLoading={jest.fn()} setWarehouse={setupFunction} />);
        
        const name = screen.getByLabelText(/nome/i);
        const height = screen.getByLabelText(/altezza/i);
        const width = screen.getByLabelText(/larghezza/i);
        const depth = screen.getByLabelText(/profondità/i);
    
        await userEvent.type(name, "myWhs");
        await userEvent.type(height, "20");
        await userEvent.type(width, "60");
        await userEvent.type(depth, "80");
    
        act(() => fireEvent.click(screen.getByText(/crea/i)));
    
        await waitFor(() => expect(setupFunction).toBeCalled());
    });

    test('WhsSetupFromInput should not call setWarehouse if some parameters are missing', async () => {        
        const setupFunction = jest.fn();
    
        render(<WhsSetupFromInput loading={false} setLoading={jest.fn()} setWarehouse={setupFunction} />);
        
        const name = screen.getByLabelText(/nome/i);
        const height = screen.getByLabelText(/altezza/i);
    
        await userEvent.type(name, "myWhs");
        await userEvent.type(height, "20");
    
        act(() => fireEvent.click(screen.getByText(/crea/i)));
    
        let errorMsg = await screen.findByText(/parametri.*mancanti.*/i);
        await waitFor(() => expect(errorMsg).toBeInTheDocument());
        await waitFor(() => expect(setupFunction).toBeCalledTimes(0));
    });

    test('WhsSetupFromInput should NOT call setWarehouse function on submit if svg format is incorrect', async () => {
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
    
        render(<WhsSetupFromInput loading={false} setLoading={jest.fn()} setWarehouse={setupFunction} />);
        
        const svgUploader = screen.getByLabelText(/svg|file/i);
        const name = screen.getByLabelText(/nome/i);
        const height = screen.getByLabelText(/altezza/i);
    
        const file = new File(['hello'], 'hello.svg', {type: 'image/svg+xml'});
        await userEvent.upload(svgUploader, file);
    
        await userEvent.type(name, "myWhs");
        await userEvent.type(height, "20");
    
        act(() => fireEvent.click(screen.getByText(/crea/i)));
        
        let errorMsg = await screen.findByText(/formato.*non.*corretto/i);
        await waitFor(() => expect(errorMsg).toBeInTheDocument());
        await waitFor(() => expect(setupFunction).toBeCalledTimes(0));
    });
});
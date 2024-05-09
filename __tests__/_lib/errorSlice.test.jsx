import { render } from "../../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
// mocks
jest.mock('../../_lib/fileManagementSlice.js', () => {
	return {
		fileManagementSlice: (set, get) => ({ })
	}
});
jest.mock('../../_lib/interactionsSlice.js', () => {
	return {
		interactionsSlice: (set, get) => ({ })
	}
});
jest.mock('../../_lib/productsSlice.js', () => {
	return {
		productsSlice: (set, get) => ({ })
	}
});
jest.mock('../../_lib/shelvesSlice.js', () => {
	return {
		shelvesSlice: (set, get) => ({ })
	}
});
jest.mock('../../_lib/whsSlice.js', () => {
	return {
		whsSlice: (set, get) => ({ })
	}
});
//

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('errorSlice should set message correctly', () => { 
	const selector = (state) => ({
        errorMsg: state.errorMsg,
        setError: state.setError
    });

	let firstRender = true;
	let msg = null;
	effect = jest.fn((items) => {
        msg = items.errorMsg;

        if(firstRender) {
            items.setError("My error message");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(msg).toEqual("My error message");
});

test('errorSlice should clear message correctly', () => { 
	const selector = (state) => ({
        errorMsg: state.errorMsg,
        setError: state.setError,
        clearError: state.clearError
    });

	let firstRender = true;
	let msg = '';
	effect = jest.fn((items) => {
        msg = items.errorMsg;

        if(firstRender) {
            items.setError("My error message");
            items.clearError();
            firstRender = false;
        }   
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(msg).toEqual(null);
});
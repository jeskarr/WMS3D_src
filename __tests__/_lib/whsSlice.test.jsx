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

// errorSlice MOCK
const setError = jest.fn();
jest.mock('../../_lib/errorSlice.js', () => {
	return {
		errorSlice: (set, get) => ({
			errorMsg: null,
			setError: () => {setError()}
		})
	}
});
//

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('whsSlice should set whs name correctly', () => { 
	const selector = (state) => ({
        whsName: state.whsName,
        setWhsName: state.setWhsName
    });

	let firstRender = true;
	let name = null;
	effect = jest.fn((items) => {
        name = items.whsName;

        if(firstRender) {
            items.setWhsName("MyNewWhs");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(name).toEqual("MyNewWhs");
});

test('whsSlice should NOT set whs name if length is > 20, it should set error', () => { 
	const selector = (state) => ({
        whsName: state.whsName,
        setWhsName: state.setWhsName
    });

	let firstRender = true;
	let name = null;
	effect = jest.fn((items) => {
        name = items.whsName;

        if(firstRender) {
            items.setWhsName("supercalifragilistice");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(name).not.toEqual("supercalifragilistice");
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set whs name if characters are different from letters, numbers and underscores, it should set error', () => { 
	const selector = (state) => ({
        whsName: state.whsName,
        setWhsName: state.setWhsName
    });

	let firstRender = true;
	let name = null;
	effect = jest.fn((items) => {
        name = items.whsName;

        if(firstRender) {
            items.setWhsName("$hello$");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(name).not.toEqual("$hello$");
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set whs name if name is empty, it should set error', () => { 
	const selector = (state) => ({
        whsName: state.whsName,
        setWhsName: state.setWhsName
    });

	let firstRender = true;
	let name = null;
	effect = jest.fn((items) => {
        name = items.whsName;

        if(firstRender) {
            items.setWhsName("");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(name).not.toEqual("");
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should set polygon correctly', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 220, z: 10 },
		{ x: 300, z: 210 },
		{ x: 170, z: 250 },
		{ x: 123, z: 234 }
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 45);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).toEqual(45);
	expect(points).toEqual(newPoints);
});

test('whsSlice should NOT set polygon if points.length < 3, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 220, z: 10 },
		{ x: 300, z: 210 }
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 45);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).not.toEqual(45);
	expect(points).not.toEqual(newPoints);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set polygon if depth > 1000, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 0, z: 50 },
		{ x: 100, z: 0 },
		{ x: 250, z: 1001}
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 12);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(12);
	expect(points).not.toEqual(newPoints);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set polygon if width > 1000, it should set error', () => {
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 0, z: 50 },
		{ x: 1001, z: 0 },
		{ x: 250, z: 100}
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 27);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(27);
	expect(points).not.toEqual(newPoints);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set polygon if height > 50, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 0, z: 50 },
		{ x: 102, z: 0 },
		{ x: 250, z: 100}
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 51);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(51);
	expect(points).not.toEqual(newPoints);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set polygon if width < 0.01, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 0, z: 50 },
		{ x: 0.002, z: 0 },
		{ x: 0.00003, z: 100}
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 4);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(4);
	expect(points).not.toEqual(newPoints);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set polygon if depth < 0.01, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 0, z: 0 },
		{ x: 50, z: 0.001 },
		{ x: 120, z: 0.0002}
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 48);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(48);
	expect(points).not.toEqual(newPoints);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set polygon if height < 0.01, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 0, z: 0 },
		{ x: 50, z: 55 },
		{ x: 120, z: 100}
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 0.000000000007);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(0.000000000007);
	expect(points).not.toEqual(newPoints);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should set rectangle correctly', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(40, 20, 10);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).toEqual(10);
	expect(points).toContainEqual({x: 10, z: 20});
	expect(points).toContainEqual({x: -10, z: 20});
	expect(points).toContainEqual({x: 10, z: -20});
	expect(points).toContainEqual({x: -10, z: -20});
});

test('whsSlice should NOT set rectangle if width is empty, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(40, null, 10);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).not.toEqual(10);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if depth is empty, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(null, 20, 10);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).not.toEqual(10);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if height is empty, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(40, 20, null);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if depth > 1000, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(1001, 20, 10);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(10);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if width > 1000, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(40, 1001, 10);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(10);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if heigth > 1000, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(40, 20, 51);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(51);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if width < 0.01, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(40, -1, 10);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(10);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if depth < 0.01, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(-3300, 45, 10);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(10);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});

test('whsSlice should NOT set rectangle if height < 0.01, it should set error', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(70, 45, 0.00005);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);
	
	expect(height).not.toEqual(0.00005);
	expect(points.length).toEqual(0);
	expect(setError).toHaveBeenCalled();
});
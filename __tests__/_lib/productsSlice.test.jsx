import { render } from "../../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
import Product from "@_model/Product";
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
jest.mock('../../_lib/whsSlice.js', () => {
	return {
		whsSlice: (set, get) => ({ })
	}
});

// shelvesSlice MOCK
const removeProductFromBin = jest.fn();
jest.mock('../../_lib/shelvesSlice.js', () => {
	return {
		shelvesSlice: (set, get) => ({
            getBinsWithProduct: (product) => {
                return [
                    {
                        binId: "fromShelfID+0+0"
                    },
                    {
                        binId: "fromShelfID+0+1"
                    }
                ];
            },
            removeProductFromBin: (shelfId, row, col) => removeProductFromBin(shelfId, row, col)
        })
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

test('productsSlice should set products correctly', () => { 
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(products).toEqual(myProducts);
});

test('productsSlice should NOT set products if there are duplicate names, it should set error', () => { 
    let myProducts = [];
    myProducts.push(new Product("myFirstProd", {r: 2, g: 20, b: 200}, "firstProdID"));
    myProducts.push(new Product("myFirstProd", {r: 2, g: 20, b: 200}, "secondProdID"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(products.length).toEqual(0);
    expect(setError).toHaveBeenCalled();
});

test('productsSlice should NOT set products if there are duplicate ids, it should set error', () => { 
    let myProducts = [];
    myProducts.push(new Product("myFirstProd", {r: 2, g: 20, b: 200}, "A001"));
    myProducts.push(new Product("mySecondProd", {r: 2, g: 20, b: 200}, "A001"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(products.length).toEqual(0);
    expect(setError).toHaveBeenCalled();
});

test('productsSlice should add new product correctly', () => {
    const selector = (state) => ({
        products: state.products,
        addProduct: state.addProduct
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.addProduct("myProduct", {r: 2, g: 20, b: 200});
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productFound = false;
    for (let index = 0; index < products.length; index++) {
        if(products[index].name === "myProduct" && JSON.stringify(products[index].color) === JSON.stringify({r: 2, g: 20, b: 200}))
            productFound = true;
    }

	expect(productFound).toEqual(true);
});

test('productsSlice should NOT add new product if name already exists, it should set error', () => {
    let myProducts = [];
    myProducts.push(new Product("myFirstProd", {r: 2, g: 20, b: 200}, "A001"));
    
    const selector = (state) => ({
        products: state.products,
        addProduct: state.addProduct,
        setProducts: state.setProducts
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            items.addProduct("myFirstProd", {r: 2, g: 20, b: 200});
            firstRender = false;
        }   
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(products.length).toEqual(1);
    expect(setError).toHaveBeenCalled();
});

test('productsSlice should remove products correctly', () => {
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts,
        removeProduct: state.removeProduct
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            items.removeProduct("secondProd");
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productFound = false;
    for (let index = 0; index < products.length; index++) {
        if(products[index].id === "secondProd") {
            productFound = true;
            break;
        }
    }

	expect(productFound).toEqual(false);
});

test('productsSlice should update product name correctly', () => { 
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts,
        updateName: state.updateName
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            items.updateName("secondProd", "myNewSecondProd");
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productName = '';
    for (let index = 0; index < products.length; index++) {
        if(products[index].id === "secondProd") {
            productName = products[index].name;
            break;
        }
    }

	expect(productName).toEqual("myNewSecondProd");
});

test('productsSlice should NOT update product name if it already exists, it should set error', () => { 
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts,
        updateName: state.updateName
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            items.updateName("secondProd", "firstProd");
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productName = '';
    for (let index = 0; index < products.length; index++) {
        if(products[index].id === "secondProd") {
            productName = products[index].name;
            break;
        }
    }

	expect(productName).toEqual("secondProd");
    expect(setError).toHaveBeenCalled();
});

test('productsSlice should update product color correctly', () => { 
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts,
        updateColor: state.updateColor
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            items.updateColor("secondProd", {r: 120, g: 0, b: 15});
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productColor = {};
    for (let index = 0; index < products.length; index++) {
        if(products[index].id === "secondProd") {
            productColor = products[index].color;
            break;
        }
    }

	expect(JSON.stringify(productColor)).toEqual(JSON.stringify({r: 120, g: 0, b: 15}));
});

test('productsSlice should empty shelves when removing product', () => {
    let myProduct = [new Product("firstProd", {r: 2, g: 20, b: 200}, "myProductId")];

    const selector = (state) => ({
        setProducts: state.setProducts,
        removeProduct: state.removeProduct
    });

	let firstRender = true;
	effect = jest.fn((items) => {
        if(firstRender) {
            items.setProducts(myProduct);
            items.removeProduct("myProductId");
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(removeProductFromBin).toHaveBeenCalledWith("fromShelfID", "0", "0");
    expect(removeProductFromBin).toHaveBeenCalledWith("fromShelfID", "0", "1");
});
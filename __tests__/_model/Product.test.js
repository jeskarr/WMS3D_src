import Product from "@_model/Product"

test('Product should return correct name', () => { 
    const newProduct = new Product("newProduct");
	expect(newProduct.name).toEqual("newProduct");
});

test('Product should return correct color', () => { 
    const newProduct = new Product("newProduct", {r: 10, g: 20, b: 30});
	expect(newProduct.color).toEqual({r: 10, g: 20, b: 30});
});

test('Product should return correct id', () => { 
    const newProduct = new Product("newProduct", {r: 10, g: 20, b: 30}, '00AC');
	expect(newProduct.id).toEqual('00AC');
});

test('Product should set new name correctly', () => { 
    const newProduct = new Product("newProduct");
	newProduct.name = "myName";
	expect(newProduct.name).toEqual("myName");
});

test('Product should set new color correctly', () => { 
    const newProduct = new Product("newProduct", {r: 10, g: 20, b: 30});
	newProduct.color = {r: 200, g: 20, b: 2};
	expect(newProduct.color).toEqual({r: 200, g: 20, b: 2});
});
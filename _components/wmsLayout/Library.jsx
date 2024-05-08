import { Tree, Input } from 'antd';
import { useState } from 'react';
import { boundStore } from '@_lib/boundStore';

const { Search } = Input;

const Library = () => {
	const shelves = boundStore((state) => state.shelves);
	const products = boundStore((state) => state.products);
	const setSelectedShelf = boundStore((state) => state.selectShelf);
	const setSelectedProduct = boundStore((state) => state.selectProduct);
	const selectedProduct = boundStore((state) => state.selectedProduct);
	const selectedShelf = boundStore((state) => state.selectedShelf);

	const [searchValue, setSearchValue] = useState('');

	const treeData = [
		{ 
			title: 'Scaffalature', 
			selectable: false, 
			key: 'shelves', 
			children: shelves.map((shelf) => (
				{ 
					title: shelf.name, 
					key: shelf.id,
					type: 'shelf'
				}
			)) 
		},
		{ 
			title: 'Prodotti', 
			selectable: false, 
			key: 'products', 
			children: products.map((product) => (
				{ 
					title: product.name, 
					key: product.id,
					type: 'product'
				}
			)) 
		}
	];

	const filteredTreeData = treeData.map((node) => {
		if (searchValue) {
			return {
				...node,
				children: node.children.filter((item) =>
					item.title.toLowerCase().includes(searchValue.toLowerCase())
				),
			};
		}
		return node;
	}).filter((node) => node.children.length > 0 || !searchValue);

	const onChange = (e) => {
		const { value } = e.target;
		setSearchValue(value);
	};

	const onSelect = (selectedKeys, info) => {
		const id = info.node.key;

		if(info.node.type === 'shelf') {
			setSelectedShelf(id);
		}
		else if(info.node.type === 'product') {
			setSelectedProduct(id);
		}

		console.log('selezionato '+ id);
	};

	return (
		<div style={{margin: 10,}}>
		<Search
			style={{
				marginBottom: 8,
			}}
			placeholder="Cerca"
			onChange={onChange}
		/>
		<Tree
			defaultExpandedKeys={['shelves', 'products']}
			treeData={filteredTreeData}
			selectedKeys={[selectedShelf, selectedProduct].filter(key => key !== null)}
			onSelect={onSelect}
		/>
		</div>
	)
};

export default Library;
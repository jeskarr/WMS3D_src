import ProductCard from '@_components/actions/ProductCard';
import BinCard from '@_components/actions/BinCard';
import ProductConfigurator from '@_components/actions/ProductConfigurator';
import ErrorModal from '@_components/ErrorModal';
import { boundStore } from '@_lib/boundStore';
import { useRef, useState, useEffect } from 'react';

const ProductManager = ({ config, setConfig, configMove }) => {
	const formRef = useRef(null);
	const [ modProduct, setModProduct ] = useState(null);
	const [ configMade, setConfigMade ] = useState(false);
	const selectedProduct = boundStore((state) => state.selectedProduct);
	const setSelectedProduct = boundStore((state) => state.selectProduct);
	const selectedBin = boundStore((state) => state.selectedBin);
	const setSelectedBin = boundStore((state) => state.selectBin);
	const removeProductFromBin = boundStore((state) => state.removeProductFromBin);
	const products = boundStore((state) => state.products);
	const addProduct = boundStore((state) => state.addProduct);
	const removeProduct = boundStore((state) => state.removeProduct);
	const updateColor = boundStore((state) => state.updateColor);
	const updateName = boundStore((state) => state.updateName);
	const error = boundStore((state) => state.errorMsg);
	const clearError = boundStore((state) => state.clearError);
	const shelves = boundStore((state) => state.shelves);
	const getBinsWithProduct = boundStore((state) => state.getBinsWithProduct);

	// Config new product or edit config of an already existing one
	const configProduct = (values) => {
		const {r, g, b} = values.productColor.metaColor ? values.productColor.metaColor : values.productColor;
		const colorRGB = {r: r, g: g, b: b};
		// Create product
		if(modProduct === null) {
			addProduct(values.productName, colorRGB);
		}
		// Edit product
		else {
			updateName(modProduct, values.productName);
			updateColor(modProduct, colorRGB);
		}

		setConfigMade(true);
	}

	useEffect(() => {
		if(configMade === true && error === null && config === true) {
			handleCloseConfigurator();
		}
	}, [error, config, configMade]);

	const handleCloseConfigurator = () => {
		formRef.current.resetFields();
		setModProduct(null);
		setConfig(false);
		setConfigMade(false);
	}

	// Product card management
	const handleProductEdit = () => {
		setModProduct(selectedProduct);
		setConfig(true);
	}

	const handleProductPositioning = () => {
		configMove(true);
	}

	const handleProductDelete = () => {
		removeProduct(selectedProduct);
		setSelectedProduct();
	}

	const handleCloseProductCard = () => {
		setSelectedProduct();
	}


	// Bin card management
	const handleProductMovement = () => {
		configMove(true);
	}

	const handleCloseBinCard = () => {
		setSelectedBin();
	}

	const handleRemoveFromBin = () => {
		const binInfo = selectedBin.split("+");
		removeProductFromBin(binInfo[0], binInfo[1], binInfo[2]);
		setSelectedBin();
	}

	const handleBinSelection = (id) => {
		setSelectedBin(id);
	}

	// Errors 
	const onCancelErrorProduct = () => {
		setConfigMade(false);
		clearError();
	}

	return (
		<>
			{selectedProduct && (
				<ProductCard 
					handleCloseProductCard={handleCloseProductCard} 
					handleProductDelete={handleProductDelete}
					handleProductEdit={handleProductEdit}
					handleProductPositioning={handleProductPositioning}
					selectedProduct={products.find(item => item.id === selectedProduct)} 
					handleBinSelection={(binId) => handleBinSelection(binId)}
					binsWithProduct={getBinsWithProduct(selectedProduct)}
				/>
			)}

			{selectedBin && (
				<BinCard 
					handleProductMovement={handleProductMovement}
					handleRemoveFromBin={handleRemoveFromBin}
					handleCloseBinCard={handleCloseBinCard}
					selectedProduct={products.find(
						product => product.id === (shelves.find(shelf => shelf.id === selectedBin.split("+")[0])).bins[selectedBin.split("+")[1]][selectedBin.split("+")[2]].productId
					)}
					selectedBin={shelves.find(
						shelf => shelf.id === selectedBin.split("+")[0]).bins[selectedBin.split("+")[1]][selectedBin.split("+")[2]]
					}
				/>
			)}
			
			{config && (
				<ProductConfigurator 
					formRef={formRef}
					onFinishedConfig={(values) => configProduct(values)}
					modProduct={modProduct ? products.find(product => product.id === modProduct) : null} 
					open={config}
					closeDrawer={handleCloseConfigurator} 
				/>
			)}

			{error && config && (
				<ErrorModal error={error} onCancel={onCancelErrorProduct} />
			)}
		</>
	)
};

export default ProductManager;
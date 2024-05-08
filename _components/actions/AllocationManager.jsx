import ErrorModal from '@_components/ErrorModal';
import AllocationRequest from './AllocationRequest';
import { boundStore } from '@_lib/boundStore';
import { useRef, useState, useEffect } from 'react';

const AllocationManager = ({ config, setConfig}) => {
    const [ configMade, setConfigMade ] = useState(false);
	const formRef = useRef(null);
	const shelves = boundStore((state) => state.shelves);
    const products = boundStore((state) => state.products);
	const selectedBin = boundStore((state) => state.selectedBin);
	const selectedProduct = boundStore((state) => state.selectedProduct);
    const error = boundStore((state) => state.errorMsg);
	const clearError = boundStore((state) => state.clearError);
    const orderMovementFromSelected = boundStore((state) => state.orderMovementFromSelected);
    const insertProduct = boundStore((state) => state.insertProduct);

    const configAllocation = (values) => {
        // Position product
		if(selectedProduct) {
			insertProduct(selectedProduct, values.destinationShelf, values.destinationBinRow, values.destinationBinCol);
		}
		// Request Move
		else if (selectedBin) {
            orderMovementFromSelected(values.destinationShelf, values.destinationBinRow, values.destinationBinCol);
		}

		setConfigMade(true);
    }

	useEffect(() => {
		if(configMade === true && error === null && config === true) {
			handleCloseRequest();
		}
	}, [error, config, configMade]);

    const handleCloseRequest = () => {
        formRef.current.resetFields();
        setConfig(false);
        setConfigMade(false);
    }

    const onCancelErrorAllocation = () => {
        setConfigMade(false);
        clearError();
	}
    
	return (
		<>
			{config && (
				<AllocationRequest 
					formRef={formRef}
					shelves={shelves}
					onFinishedConfig={(values) => configAllocation(values)}
					selectedProduct={selectedProduct ? products.find(product => product.id === selectedProduct) : null}
					selectedBin={selectedBin}
					open={config}
					closeDrawer={handleCloseRequest}
            	/>
			)}
			{error && config && (
				<ErrorModal error={error} onCancel={onCancelErrorAllocation} />
			)}
		</>
	)
};

export default AllocationManager;
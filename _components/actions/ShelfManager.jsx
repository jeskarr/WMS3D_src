import ShelfCard from '@_components/actions/ShelfCard';
import ShelfConfigurator from '@_components/actions/ShelfConfigurator';
import ErrorModal from '@_components/ErrorModal'
import { boundStore } from '@_lib/boundStore';
import { useRef, useState, useEffect } from 'react';

const ShelfManager = ({ config, setConfig }) => {
	const [ modShelf, setModShelf ] = useState(null);
	const [ configMade, setConfigMade ] = useState(false);
	const [ cancellation, setCancellation ] = useState(false);
	const [ currentStep, setCurrentStep ] = useState(0);
	const [ originalPos, setOriginalPos ] = useState(null);		// store position of shelf before edit
	const formRef = useRef(null);
	const selectedShelf = boundStore((state) => state.selectedShelf);
	const setSelectedShelf = boundStore((state) => state.selectShelf);
	const removeShelf = boundStore((state) => state.removeShelf);
	const addShelf = boundStore((state) => state.addShelf);
	const updateShelfInfo = boundStore((state) => state.updateShelfInfo);
	const shelves = boundStore((state) => state.shelves);
	const error = boundStore((state) => state.errorMsg);
	const clearError = boundStore((state) => state.clearError);
	const setMovingShelf = boundStore((state) => state.setMovingShelf);
	const updateShelfPosition = boundStore((state) => state.updateShelfPosition);
	const movingShelf = boundStore((state) => state.movingShelf);

	// Shelf card management
	const handleShelfDelete = () => {
		setCancellation(true);
		removeShelf(selectedShelf);
		setSelectedShelf();
	}

	const handleShelfEdit = () => {
		setModShelf(selectedShelf);
		setOriginalPos(shelves.find((shelf) => shelf.id === selectedShelf).position);
		setConfig(true);
	}

	const handleCloseCard = () => {
		setSelectedShelf();
	}

	// Config new shelf or edit config of an already existing one
	// Info config
	const configShelf = (values) => {
		// New shelf
		if(modShelf === null) {
			addShelf(values.shelfName, values.binSize, values.shelfHeight, values.shelfWidth);
		}
		// Edit Shelf
		else {
			updateShelfInfo(modShelf, values.shelfName, values.binSize, values.shelfWidth, values.shelfHeight);
		} 

		setConfigMade(true);
	}

	// Position config
	const onShelfPosition = () => {
		const currentPosition = shelves.find((shelf)=>shelf.id === movingShelf).position;
		updateShelfPosition(movingShelf, currentPosition.x, currentPosition.z);
		setConfigMade(true);
	}

	const nextStep = () => {
		setCurrentStep(currentStep + 1);
	};

	useEffect(() => {
		if(configMade === true && error === null && config === true) {
			if(currentStep === 0){
				const currentShelf = modShelf ? modShelf : shelves[shelves.length-1].id;
				setSelectedShelf(currentShelf);
				setMovingShelf(currentShelf);
				nextStep();
			}
			else if(currentStep === 1) {
				handleCloseConfigurator();
			}
			setConfigMade(false);
		}
	}, [error, config, configMade]);

	const onCancelConfig = () => {
		if(currentStep === 1) {
			if(modShelf === null) {
				// Remove newly created shelf
				removeShelf(shelves[shelves.length-1].id);
				setSelectedShelf();
			}
			else {
				// Position back to original (before edit)
				updateShelfPosition(modShelf, originalPos.x, originalPos.z)
			}
		}
		handleCloseConfigurator();
	}

	const handleCloseConfigurator = () => {
		formRef.current?.resetFields();
		setModShelf(null);
		setConfig(false);
		setConfigMade(false);
		setOriginalPos(null);
		setMovingShelf();
		setCurrentStep(0);
	}

	// Errors
	const onCancelErrorShelf = () => {
		if(configMade) setConfigMade(false);
		if(cancellation) setCancellation(false);
		clearError();
	}

	return (
		<>
			{selectedShelf && (
				<ShelfCard 
					handleCloseCard={handleCloseCard} 
					handleShelfDelete={handleShelfDelete}
					handleShelfEdit={handleShelfEdit}
					selectedShelf={shelves.find(shelf => shelf.id === selectedShelf)} 
				/>
			)}

			{config && ( 
				<ShelfConfigurator 
					current={currentStep}
					formRef={formRef}
					onFinishedConfig={(values) => configShelf(values)}
					onShelfPosition={onShelfPosition}
					modShelf={modShelf ? shelves.find(shelf => shelf.id === modShelf) : null} 
					open={config} 
					closeDrawer={onCancelConfig} 
				/>
			)}

			{error && (config || cancellation) && (
				<ErrorModal error={error} onCancel={onCancelErrorShelf} />
			)}
		</>
	)
};

export default ShelfManager;
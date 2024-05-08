'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { boundStore } from '@_lib/boundStore';
import { Tabs } from 'antd'
import ErrorModal from '@_components/ErrorModal'
import  WhsSetupFromInput from '@_components/setup/WhsSetupFromInput'
import  WhsSetupFromJson from '@_components/setup/WhsSetupFromJson'

const WhsSetupPage = () => {
	const [onSetup, setOnSetup] = useState(false);
	const [settingsMade, setSettingsMade] = useState(false);
	const router = useRouter();
	const setWhsName = boundStore((state) => state.setWhsName);
	const setWhsRectangle = boundStore((state) => state.setWhsRectangle);
	const jsonToState = boundStore((state) => state.jsonToState);
	const svgToState = boundStore((state) => state.svgToState);
	const error = boundStore((state) => state.errorMsg);
	const clearError = boundStore((state) => state.clearError);

	useEffect(() => {
		if(settingsMade === true && error === null && onSetup === true) {
			router.push('/wms');
		}
	}, [error, onSetup, settingsMade]);

	const setWarehouseFromInput = (mod, values) => {
		// Default rect floor
		if(!mod) {
			setWhsName(values.warehouseName);
			setWhsRectangle(values.warehouseDepth, values.warehouseWidth, values.warehouseHeight);
		}
		// Custom svg floor
		else {	
			setWhsName(values.warehouseName);
			svgToState(values.svgUpload.fileContent, values.warehouseHeight);
		}	
		
		setSettingsMade(true);
	}

	const setWarehouseFromJson = (values) => {
		jsonToState(values);
		setSettingsMade(true);
	}

	const forms = [
		{ 
		  key: '1',
		  label: 'Setup manuale',
		  disabled: onSetup,
		  children: 
		  	<WhsSetupFromInput 
				loading={onSetup} 
				setLoading={(bool) => setOnSetup(bool)}
				setWarehouse={ (mod, values) => setWarehouseFromInput(mod, values) }
			/>,
		},
		{
		  key: '2',
		  label: 'Setup da file',
		  disabled: onSetup,
		  children: 
			<WhsSetupFromJson 
				loading={onSetup} 
				setLoading={(bool) => setOnSetup(bool)}
				setWarehouse= { (values) => setWarehouseFromJson(values) } 
			/>,
		},
	];

	const onCancel = () => {
		setOnSetup(false);
		clearError();
		setSettingsMade(false);
	}

	return (
		<div style={{backgroundColor: 'white', paddingTop: '3vh', paddingBottom: '3vh', paddingLeft: '5vw', paddingRight: '5vw', borderRadius: '16px'}}>
			<h1>Benvenuto in WMS3D!</h1>
			<p>Inizia subito a configurare il tuo magazzino!</p>
			<Tabs 
				defaultActiveKey="1" 
				type="card" 
				items={forms}
			/>

			<ErrorModal error={error} onCancel={onCancel} />
		</div>
	);
};

export default WhsSetupPage;
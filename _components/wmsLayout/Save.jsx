import { Button } from 'antd';
import { SaveOutlined } from '../../node_modules/@ant-design/icons';
import { boundStore } from '@_lib/boundStore';

const Save = () => {
	const whsName = boundStore((state) => state.whsName);
	const stateToJson = boundStore((state) => state.stateToJson);

	const saveWarehouse = () => {
		const json = stateToJson();
		const jsonBlob = new Blob([JSON.stringify(json)], { type: 'application/json' });

		// Create URL for Blob
		const url = URL.createObjectURL(jsonBlob);

		// Create a link element
		const link = document.createElement('a');
		link.href = url;
		link.download = whsName ? (whsName + '.json') : 'data.json'; // Set default filename

		// Programmatically trigger the download
		//document.body.appendChild(link);
		link.click();

		// Clean up
		//document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	return (
		<Button
			type="text"
			icon={<SaveOutlined/>}
			onClick={() => saveWarehouse()}
			style={{
				color: 'white',
				fontSize: '16px',
				marginRight: 10,
			}}
		>
		Salva <strong> { whsName }</strong>
		</Button>
	)
};

export default Save;
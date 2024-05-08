import { useState } from 'react';
import { Form, Button, Upload, message } from 'antd';
import { UploadOutlined } from '../../node_modules/@ant-design/icons';

const WhsSetupFromJson = ({ loading, setLoading, setWarehouse }) => {

	const hasError = async (data) => {
		const response = await fetch(
			'/api/parsing/jsonParser',
			{
				method: 'POST',
				body: data,
			}
		);
		const {message, err} = await response.json();
		return err;
	}

    const onFinish = async (values) => {
		setLoading(true);

		if(!values.fileUpload) {
			setLoading(false);
			message.error("Il file non è stato inserito.");
			return;
		}

		const file = values.fileUpload[0].originFileObj;

		// Read file
		const reader = new FileReader();
    	reader.onload = async (event) => {
      		const fileContent = event.target.result;

			// Check file validity with api
			const error = await hasError(fileContent);
			if (!error) {
				// Config warehouse correctly
				setWarehouse(fileContent);
			} 
			else {
				setLoading(false);
				message.error("Il formato del file JSON non è corretto.");
			}
		}
		reader.readAsText(file);
	};

	const onFinishFailed = (values) => {
		console.log('Failed');
	};
  

	const beforeUpload = (file) => {
		const isJson = file.type === 'application/json';
		if (!isJson) {
			message.error('Puoi caricare solo file JSON!');
		} 
		return isJson || Upload.LIST_IGNORE;
	};

	return (
		
		<Form
            name="WhsSetupFromJson"
            id="WhsSetupFromJson"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >              
            <Form.Item
                name="fileUpload"
                id="fileUpload"
				data-testid="fileUpload"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                    	return e;
                    }
                    return e && e.fileList;
                }}
            >
                <Upload.Dragger 
					disabled={ loading }
                    maxCount={1} 
                    accept=".json"
					data-testid="fileUploadDragger"
                    beforeUpload={beforeUpload}
					customRequest={()=>{}}
                >
					<p className="ant-upload-drag-icon">
            			<UploadOutlined />
          			</p>
					<p className="ant-upload-text">Clicca o trascina un file qui per caricare</p>
					<p className="ant-upload-hint">Inserire solo file generati dal programma.</p>
                </Upload.Dragger>
            </Form.Item>                

            <Form.Item>
                <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                >
                    Crea
                </Button>
            </Form.Item>
        </Form>
	);
}

export default WhsSetupFromJson;

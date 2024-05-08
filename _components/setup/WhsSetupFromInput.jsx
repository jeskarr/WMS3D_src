import { useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, Divider, message } from 'antd';
import { UploadOutlined } from '../../node_modules/@ant-design/icons';

const WhsSetupFromInput = ({ loading, setLoading, setWarehouse }) => {
    const [svgUploaded, setSvgUploaded] = useState(false);

    const hasError = async (data) => {
		const response = await fetch(
			'/api/parsing/svgParser',
			{
				method: 'POST',
				body: JSON.stringify({data: data}),
			}
		);
		const {message, err} = await response.json();
		return err;
	};

    const onFinish = (values) => {
        setLoading(true);
        
        if(svgUploaded) {
            const file = values.svgUpload[0].originFileObj;

            // Read file
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target.result;
                // Check file validity with api
                const error = await hasError(fileContent);
                if (!error) {
                    values.svgUpload.fileContent = fileContent;

                    // Config floor
                    setWarehouse(svgUploaded, values);
                } 
                else {
                    setLoading(false);
                    message.error("Il formato del file SVG non è corretto.");
                }
            }
            reader.readAsText(file);
        }
        else {
            setWarehouse(svgUploaded, values);
        }
	};

	const onFinishFailed = (values) => {
		//console.log('Failed: ' + JSON.stringify(values));
        message.error("Alcuni parametri non sono corretti o sono mancanti.");
	};

	const onFileChange = (info) => {
		if (info.file.status === 'done' || info.file.status === 'removed') {
			setSvgUploaded(info.fileList.length > 0);
		}
    };
    

	const beforeUpload = (file) => {
		const isSvg = file.type === 'image/svg+xml';
		if (!isSvg) {
			message.error('Puoi caricare solo file SVG!');
		} else {
			setSvgUploaded(true);
		}
		return isSvg || Upload.LIST_IGNORE;
	};

	return (
		<Form
            name="WhsSetupFromInput"
            id="WhsSetupFromInput"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Nome"
                name="warehouseName"
                id="warehouseName"
                rules={[
                    { 
                        required: true, 
                        message: 'Si prega di inserire il nome del magazzino.' 
                    },
                    {
                        max: 20,
                        message: 'Il nome del magazzino non può superare i 20 caratteri.',
                    },
                    {
                        pattern: /^[a-zA-Z0-9_]+$/,
                        message: 'Il nome del magazzino può contenere solo lettere, numeri e underscore (_).',
                    },
                ]}
            >
                <Input 
                    disabled={ loading } 
                />
            </Form.Item>
            <Form.Item
                label="Altezza (mt)"
                name="warehouseHeight"
                id="warehouseHeight"
                rules={[{ 
                    required: true,
                    message: 'Si prega di inserire l\'altezza del magazzino.' 
                }]}
            >
                <InputNumber 
                    disabled={loading}
                    step={1}
                    precision={2}
                    min={0.01}
                    max={50}
                />
            </Form.Item>
            
            <div style={{marginBottom: '15px'}}><strong>Setup del pavimento:</strong></div>
            <Form.Item
                label="Larghezza (mt)"
                name="warehouseWidth"
                id="warehouseWidth"
                rules={[{ 
                    required: !svgUploaded && !svgUploaded,
                    message: 'Si prega di inserire la larghezza del magazzino.' 
                }]}
            >
                <InputNumber 
                    disabled={svgUploaded || loading} 
                    step={1}
                    precision={2}
                    min={0.01}
                    max={1000}
                />
            </Form.Item>

            <Form.Item
                label="Profondità (mt)"
                name="warehouseDepth"
                id="warehouseDepth"
                rules={[{ 
                    required: !svgUploaded && !svgUploaded, 
                    message: 'Si prega di inserire la profonfità del magazzino.' 
                }]}
            >
                <InputNumber 
                    disabled={svgUploaded || loading} 
                    step={1}
                    precision={2}
                    min={0.01}
                    max={1000}
                />
            </Form.Item>

            <Divider plain>oppure</Divider>
                
            <Form.Item
                label="Carica file (.svg)"
                name="svgUpload"
                id="svgUpload"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                        return e;
                    }
                    return e && e.fileList;
                }}
            >
                <Upload 
                    disabled={loading}
                    maxCount={1} 
                    onChange={onFileChange} 
                    accept=".svg"
                    beforeUpload={beforeUpload}
                    customRequest={()=>{}}
                >
                    <Button disabled={loading} icon={<UploadOutlined />}>Carica</Button>
                </Upload>
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

export default WhsSetupFromInput;

import { Button, Space, Drawer, Form, Input, ColorPicker } from 'antd';
import { useEffect } from 'react';

const ProductConfigurator = ({formRef, onFinishedConfig, modProduct, open, closeDrawer}) => {
	const handleSubmit = () => {
		formRef.current.submit();
	}

	return (
		<Drawer
			title={modProduct ? "Modifica prodotto" : "Aggiungi prodotto"}
			placement="right"
			width={450}
			open={open}
			closable={false}
			mask={false}
			extra={
				<Space>
					<Button onClick={closeDrawer}>Annulla</Button>
					<Button onClick={handleSubmit} type="primary">
						{modProduct ? 'Modifica' : 'Aggiungi'}
					</Button>
				</Space>
			}
		>
			<Form
				name="productSetup"
				ref={formRef}
				onFinish={onFinishedConfig}
        	>
				<Form.Item
					label="Nome"
					name="productName"
					initialValue={modProduct ? modProduct.name : ''}
					rules={[
						{
							required: true,
							message: 'Inserire un nome per il prodotto.',
						},
						{
							max: 20,
							message: 'Il nome del prodotto non può superare i 20 caratteri.',
						},
						{
							pattern: /^[a-zA-Z0-9_]+$/,
							message: 'Il nome del prodotto può contenere solo lettere, numeri e underscore (_).',
						},
					]}
				>
                    <Input />
                </Form.Item>
				<Form.Item
					label="Colore prodotto"
					name="productColor"
					initialValue={modProduct ? modProduct.color : {r: 0, g: 0, b: 0}}
					rules={[
						{
							required: true,
							message: 'Inserire un colore per il prodotto.',
						},
					]}
				>
					<ColorPicker data-testid="ProductColorPicker" />
				</Form.Item>
            </Form>
		</Drawer>
	)
};

export default ProductConfigurator;
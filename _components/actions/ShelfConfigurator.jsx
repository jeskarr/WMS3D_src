import { Button, Space, Drawer, InputNumber, Form, Input, Steps } from 'antd';
import { useState } from 'react';

const ShelfConfigurator = ({ formRef, current, onFinishedConfig, onShelfPosition, modShelf, open, closeDrawer }) => {
	const handleSubmit = () => {
		if(current === 0) {
			formRef.current.submit();
		}
		else if (current === 1) {
			onShelfPosition();
		}
	}

	const steps = [
		{
			title: 'Creazione',
			content: 
				<Form
					name="shelfSetup"
					onFinish={onFinishedConfig}
					ref={formRef}
				>
					<Form.Item
						label="Nome"
						name="shelfName"
						initialValue={modShelf ? modShelf.name : ''}
						rules={[
							{
								required: true,
								message: 'Inserire un nome per la scaffalatura.',
							},
							{
								max: 20,
								message: 'Il nome della scaffalatura non può superare i 20 caratteri.',
							},
							{
								pattern: /^[a-zA-Z0-9_]+$/,
								message: 'Il nome della scaffalatura può contenere solo lettere, numeri e underscore (_).',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Dimensione bin (mt)"
						name="binSize"
						initialValue={modShelf ? modShelf.binSize : 0.01}
						rules={[
							{
								required: true,
								message: 'Inserire la dimensione del bin della scaffalatura.',
							},
						]}
					>
						<InputNumber 
							step={1}
							precision={2}
							min={0.01}
						/>
					</Form.Item>
					<Form.Item
						label="Altezza (# bin)"
						name="shelfHeight"
						initialValue={modShelf ? modShelf.height : 1}
						rules={[
							{
								required: true,
								message: 'Inserire l\'altezza in bin della scaffalatura.',
							},
						]}
					>
						<InputNumber 
							step={1}
							precision={0}
							min={1}
						/>
					</Form.Item>
					<Form.Item
						label="Larghezza (# bin)"
						name="shelfWidth"
						rules={[
							{
								required: true,
								message: 'Inserire la larghezza in bin della scaffalatura.',
							},
						]}
						initialValue={modShelf ? modShelf.width : 1}
					>
						<InputNumber 
							step={1}
							precision={0}
							min={1}
						/>
					</Form.Item>
				</Form>
			,
		},
		{
			title: 'Posizionamento',
			content: 
				<div style={{marginBottom: '20px'}}>
					Usa i controlli attaccatti alla scaffalatura nel render 3D per 
					posizionare la scaffalatura all'interno del magazzino e ruotarla.
				</div>
		},
	  ];

	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));

	return (
		<Drawer
			title={modShelf ? "Modifica scaffalatura" : "Aggiungi scaffalatura"}
			placement="right"
			width={450}
			open={open}
			closable={false}
			mask={false}
			extra={
				<Space>
					<Button onClick={closeDrawer}>Annulla</Button>
				</Space>
			}
		>	
			<Steps current={current} items={items} />
				<div style={{marginTop: '15px'}}>{steps[current].content}</div>
				{current === 0 && (
					<Button type="primary" onClick={() => handleSubmit()}>
						Vai al posizionamento
					</Button>
				)}
				{current === 1 && (
					<Button type="primary" onClick={() => handleSubmit()}>
						{modShelf ? 'Modifica' : 'Aggiungi'}
					</Button>
				)}
		</Drawer>
	)
};

export default ShelfConfigurator;
import { Button, Space, Drawer, Form, Select } from 'antd';
import { useState } from 'react';

const AllocationRequest = ({ formRef, onFinishedConfig, shelves,
    selectedProduct, selectedBin, open, closeDrawer }) => {      
 
    const [ rows, setRows ] = useState([]);
    const [ cols, setCols ] = useState([]);

	const handleSubmit = () => {
		formRef.current.submit();
    }

    const filterOption = (input, option) =>
        ((option?.label ?? '') + '').toLowerCase().includes(input.toLowerCase());

    const changeValues = (value) => {
        const maxRow = shelves.find(shelf => shelf.id === value).height - 1;
        let rows = []
        for(let i = 0; i <= maxRow; i++){
            rows.push({label: "r"+i, value: i});
        }
        setRows(rows);

        const maxCol = shelves.find(shelf => shelf.id === value).width - 1;
        let cols = []
        for(let i = 0; i <= maxCol; i++){
            cols.push({label: "c"+i, value: i});
        }
        setCols(cols);
    }

	return (
		<Drawer
			title={selectedProduct ? `Posiziona prodotto ${selectedProduct.name}` : "Sposta prodotto"}
			placement="right"
			width={450}
			open={open}
			closable={false}
			mask={false}
			extra={
				<Space>
					<Button onClick={closeDrawer}>Annulla</Button>
					<Button onClick={handleSubmit} type="primary" data-testid="submitBtn">
						{selectedProduct ? 'Posiziona' : 'Richiedi'}
					</Button>
				</Space>
			}
		>
            { selectedBin && (
                <div>
                    <strong>Bin di origine:</strong> {selectedBin}
                </div>
            )}
			<Form
				name="productAllocation"
				ref={formRef}
				onFinish={onFinishedConfig}
        	>
				<Form.Item
					label="Scaffalatura di destinazione"
					name="destinationShelf"
                    rules={[
						{
							required: true,
							message: 'Scegliere la scaffalatura di destinazione.',
						},
					]}
				>
                    <Select
                        showSearch
                        data-testid="destinationShelf"
                        placeholder="Seleziona una scaffalatura"
                        optionFilterProp="children"
                        filterOption={filterOption}
                        onChange={changeValues}
                        options={shelves.map(shelf => ({
                            label: shelf.name,
                            value: shelf.id,
                        }))}
                    />
                </Form.Item>
                <Form.Item
					label="Ripiano scaffalatura di destinazione"
					name="destinationBinRow"
                    data-testid="destinationBinRow"
                    rules={[
						{
							required: true,
							message: 'Scegliere il ripiano della scaffalatura di destinazione.',
						},
					]}
				>
                    <Select
                        showSearch
                        placeholder="Seleziona un valore"
                        optionFilterProp="children"
                        filterOption={filterOption}
                        options={rows}
                    />
                </Form.Item>
                <Form.Item
					label="Colonna scaffalatura di destinazione"
					name="destinationBinCol"
                    data-testid="destinationBinCol"
                    rules={[
						{
							required: true,
							message: 'Scegliere la colonna della scaffalatura di destinazione.',
						},
					]}
				>
                    <Select
                        showSearch
                        placeholder="Seleziona un valore"
                        optionFilterProp="children"
                        filterOption={filterOption}
                        options={cols}
                    />
                </Form.Item>
            </Form>
		</Drawer>
	)
};

export default AllocationRequest;
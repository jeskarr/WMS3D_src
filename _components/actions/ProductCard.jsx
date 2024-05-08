import { Button, Card, Table } from 'antd';
import { DeleteOutlined, EditOutlined, SelectOutlined, CloseOutlined } from '../../node_modules/@ant-design/icons';

const ProductCard = ({ handleCloseProductCard, handleProductDelete, handleProductEdit, 
	handleProductPositioning, selectedProduct, handleBinSelection, binsWithProduct }) => {

	const dataSource = binsWithProduct.map(item => ({
		key: item.binId,
		shelf: item.shelfName,
		bin: `${item.binId.split("+")[1]}-${item.binId.split("+")[2]}`
	}));
    
    const columns = [
        {
            title: 'Scaffalatura',
            dataIndex: 'shelf',
            key: 'shelf',
			sorter: (a, b) => a.shelf.localeCompare(b.shelf),
        },
        {
            title: 'Bin',
            dataIndex: 'bin',
            key: 'bin',
        },
    ];

	return (
		<Card
			title={selectedProduct.name}
			style={{
				position: 'absolute',
				top: '10px',
				right: '10px',
				zIndex: 1,
			}}
			actions={[
				<DeleteOutlined key="setting" onClick={handleProductDelete} data-testid="ProductDeleteButton" />,
				<EditOutlined key="edit" onClick={handleProductEdit} data-testid="ProductEditButton"/>,
				<SelectOutlined key="move" onClick={handleProductPositioning} data-testid="ProductPositionButton"/>,
			]}
			extra={<Button type="text" onClick={handleCloseProductCard} icon={<CloseOutlined />} />}
		>
			<p><strong>Residenza:</strong></p>
            <Table 
                dataSource={dataSource} 
                columns={columns} 
				style= {{
					width: '250px',
				}}
				pagination={false}
                scroll={{
                    y: 150,
                }}
				onRow={(record) => {
					return {
						onClick: (event) => {handleBinSelection(record.key)},
					};
				}}
            />
		</Card>
	)
};

export default ProductCard;
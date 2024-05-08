import { Button, Card } from 'antd';
import { DeleteOutlined, EditOutlined, CloseOutlined } from '../../node_modules/@ant-design/icons';

const ShelfCard = ({handleCloseCard, handleShelfDelete, handleShelfEdit, selectedShelf}) => {
	return (
		<Card
			title={selectedShelf.name}
			style={{
				position: 'absolute',
				top: '10px',
				right: '10px',
				zIndex: 1,
			}}
			actions={[
				<DeleteOutlined key="delete" onClick={handleShelfDelete} data-testid="ShelfDeleteButton"/>,
				<EditOutlined key="edit" onClick={handleShelfEdit} data-testid="ShelfEditButton"/>,
			]}
			extra={<Button type="text" onClick={handleCloseCard} icon={<CloseOutlined />} />}
		>
			<p><strong>Capacità:</strong> {selectedShelf.width}x{selectedShelf.height} bin</p>
			<p><strong>Dimensione bin:</strong> {selectedShelf.binSize}x{selectedShelf.binSize}x{selectedShelf.binSize} mt</p>
		</Card>
	)
};

export default ShelfCard;
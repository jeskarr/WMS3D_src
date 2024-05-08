import { Button, Card, message } from 'antd';
import { CloseOutlined, DeleteOutlined, SwapOutlined } from '../../node_modules/@ant-design/icons';

const BinCard = ({handleRemoveFromBin, handleProductMovement, selectedBin, handleCloseBinCard, selectedProduct}) => {
	const askForMovement = () => {
		if (selectedProduct) {
			handleProductMovement();
		}
		else {
			message.error("Impossibile chiedere movimentazione. Nessun prodotto è presente nel bin.");
		}
	}

	const askForDeletion = () => {
		if (selectedProduct) {
			handleRemoveFromBin();
		}
		else {
			message.error("Nessun prodotto è presente nel bin. Impossibile eliminare.");
		}
	}

	return (
		<Card
			title={selectedBin.id}
			style={{
				position: 'absolute',
				top: '10px',
				right: '10px',
				zIndex: 1,
			}}
			actions={[
				<DeleteOutlined key="setting" onClick={askForDeletion} data-testid="RemoveProductButton" />,
				<SwapOutlined key="move" onClick={askForMovement} data-testid="MoveProductButton" />,
			]}
			extra={<Button type="text" onClick={handleCloseBinCard} icon={<CloseOutlined />} />}
		>
			<p><strong>Stato:</strong> {selectedBin.state}</p>
            <p><strong>Prodotto:</strong> {selectedProduct ? selectedProduct.name : "Nessuno"}</p>
		</Card>
	)
};

export default BinCard;
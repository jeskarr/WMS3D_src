import { useState } from 'react';
import { FloatButton, Tooltip } from 'antd';
import { TableOutlined, DropboxOutlined, PlusOutlined, SwapOutlined } from '../../node_modules/@ant-design/icons';

const Tools = ( {openShelfDrawer, openProductDrawer, openMovementView} ) => {
	const [open, setOpen] = useState(false);

	const toggleVisibility = () => {
		setOpen(!open);
	};

	return (
		<div id="tools">
			<Tooltip title='Apri lista movimenti' placement='left'>
				<FloatButton 
					onClick={openMovementView}
					style={{
						right: 80,
					}}
					icon={<SwapOutlined />}
					data-testid="OpenMovementViewBt"
				/>
			</Tooltip>
			<FloatButton.Group
				open={open}
				trigger="click"
				onClick={toggleVisibility}
				style={{
					right: 24,
				}}
				icon={<PlusOutlined />}
				data-testid="OpenAddOptions"
			>
				<Tooltip title='Aggiungi scaffalatura' placement='left'>
					<FloatButton 
						onClick={openShelfDrawer}
						icon={<TableOutlined />}
						data-testid="ShelfAddBt"
					/>
				</Tooltip>
				<Tooltip title='Aggiungi prodotto' placement='left'>
					<FloatButton 
						onClick={openProductDrawer}
						icon={<DropboxOutlined />}
						data-testid="ProductAddBt"
					/>
				</Tooltip>
			</FloatButton.Group>
		</div>
	);
};

export default Tools;
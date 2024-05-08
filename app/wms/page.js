'use client';
import { useState } from 'react';
import Tools from '@_components/actions/Tools';
import ProductManager from '@_components/actions/ProductManager';
import ShelfManager from '@_components/actions/ShelfManager';
import AllocationManager from '@_components/actions/AllocationManager';
import MovementManager from '@_components/actions/MovementManager';
import Render from '@_components/render/Render';

const WmsPage = () => {
	const [shelfDrawer, setShelfDrawer] = useState(false);
	const [productDrawer, setProductDrawer] = useState(false);
	const [allocationDrawer, setAllocationDrawer] = useState(false);
	const [movementDrawer, setMovementDrawer] = useState(false);

	return (
		<div style={{height: '100%', position: 'relative'}}>
			<Render />
			<ShelfManager config={shelfDrawer} setConfig={(bool) => setShelfDrawer(bool)} />
			<ProductManager 
				config={productDrawer} 
				setConfig={(bool)=>setProductDrawer(bool)} 
				configMove={(bool) => setAllocationDrawer(bool)}
			/>
			<AllocationManager config={allocationDrawer} setConfig={(bool) => setAllocationDrawer(bool)}/>
			<MovementManager open={movementDrawer} closeView={() => setMovementDrawer(false)}/>
			<Tools 
				openShelfDrawer={() => setShelfDrawer(true)} 
				openProductDrawer={() => setProductDrawer(true)} 
				openMovementView={() => setMovementDrawer(true)}
			/>
		</div>
	);
}

export default WmsPage;
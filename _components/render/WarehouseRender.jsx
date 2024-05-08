import { boundStore } from '@_lib/boundStore';
import WarehouseMesh from '@_components/render/WarehouseMesh';
import ShelvesRender from '@_components/render/ShelvesRender';
import { useRef } from 'react';

const WarehouseRender = () => {
    const whsHeight = boundStore((state) => state.whsHeight);
    const whsPoints = boundStore((state) => state.points);

	const wallsRef = useRef();
	const shelvesRef = useRef([]);
	
	return (
		<>
			<WarehouseMesh 
				height={whsHeight} 
				points={whsPoints} 
				ref={wallsRef}
			/>
			<ShelvesRender ref={shelvesRef} wallsRef={wallsRef}/>
		</>
	);
}

export default WarehouseRender;
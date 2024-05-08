import { Canvas } from "../../node_modules/@react-three/fiber";
import ThreeScene from '@_components/render/ThreeScene'
import WarehouseRender from '@_components/render/WarehouseRender'
import { useState } from "react";
import { KeyboardControls } from "../../node_modules/@react-three/drei";

const Render = () => {
	const [ isNavigating, setIsNavigating ] = useState(false);
    const handleClick = (event) => {
		event.preventDefault();
		// On Wheel down
		if (event.button === 1) {
			setIsNavigating(!isNavigating);
		}
    };

	return (
		<KeyboardControls
			map={[
				{ name: "forward", keys: ["ArrowUp", "w", "W"] },
				{ name: "backward", keys: ["ArrowDown", "s", "S"] },
				{ name: "left", keys: ["ArrowLeft", "a", "A"] },
				{ name: "right", keys: ["ArrowRight", "d", "D"] },
			]}
		>
			<Canvas 
				style={{height: '100%', position: 'relative'}} 
				onMouseDown={handleClick}
				data-testid="canvasContainer"
			>			        
				<ThreeScene isNavigating={isNavigating} />
				<WarehouseRender />
			</Canvas>
		</KeyboardControls>
	);
}

export default Render;

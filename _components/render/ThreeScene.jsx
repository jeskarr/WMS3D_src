import { useRef } from "react";
import { useFrame } from "../../node_modules/@react-three/fiber";
import { CameraControls, useKeyboardControls } from "../../node_modules/@react-three/drei";

const ThreeScene = ({isNavigating}) => {
    const cameraRef = useRef();

    const [, get] = useKeyboardControls();

    useFrame(() => {
        if (cameraRef.current.enabled) {
            const { forward, backward, left, right } = get();
            const moveSpeed = 0.25;

            cameraRef.current.forward(
                (forward ? moveSpeed : 0) + (backward ? -moveSpeed : 0)
            );
            cameraRef.current.truck((right ? moveSpeed : 0) + (left ? -moveSpeed : 0), 0);
        }
    });

	return (
        <>
            <CameraControls
                minPolarAngle={Math.PI / 10}
                maxPolarAngle={Math.PI / 3}
                ref={cameraRef}
                enabled={isNavigating}
            />
            <ambientLight />
            <gridHelper args={[1000, 1000, 'teal', 'gray']} position={[0, 0.01, 0]}/>
    
        </>
    );   
}

export default ThreeScene;
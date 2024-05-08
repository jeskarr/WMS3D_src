
import { boundStore } from '@_lib/boundStore';
import ShelfMesh from '@_components/render/ShelfMesh';
import { forwardRef, useState, useEffect } from 'react';
import { TransformControls } from '../../node_modules/@react-three/drei';
import * as THREE from 'three'

const ShelvesRender = forwardRef(({wallsRef}, ref) => {
    const selectedShelf = boundStore((state) => state.selectedShelf);
    const selectedBin = boundStore((state) => state.selectedBin);
    const selectedProduct = boundStore((state) => state.selectedProduct);
    const selectShelf = boundStore((state) => state.selectShelf);
    const selectBin = boundStore((state) => state.selectBin);
    const shelves = boundStore((state) => state.shelves);
    const products = boundStore((state) => state.products);
    const updateShelfPosition = boundStore((state) => state.updateShelfPosition);
	const flipShelf = boundStore((state) => state.flipShelf);
	const movingShelf = boundStore((state) => state.movingShelf);
    const setIntersectingIds = boundStore((state) => state.setIntersectingIds);
    const [ moved, setMoved ] = useState(false);
    const [ isReadyToMove, setIsReadyToMove ] = useState(false);

    function handleClick(shelfId, binId) {
        if (((!selectedShelf && !selectedBin) || (selectedShelf && selectedShelf != shelfId)) || (binId == selectedBin)) {
            selectShelf(shelfId);
        }
        else if ((selectedShelf == shelfId) || (selectedBin.split('+')[0] == binId.split('+')[0] && binId != selectedBin)) {
            selectBin(binId);
        }
    };
    
    function handleUnclick() {
        if(selectedShelf || selectedBin || selectedProduct)
            selectShelf(); 
    };

	const updatePos = () => {
        checkCollisions();
		updateShelfPosition(movingShelf, ref.current[movingShelf].position.x, ref.current[movingShelf].position.z);
        setMoved(true);
	}

    useEffect(() => { 
        // Keep state position (in case updateShelfPosition failed)
		if(moved) {
            ref.current[movingShelf].position.x = shelves.find((shelf) => shelf.id === movingShelf).position.x;
            ref.current[movingShelf].position.z = shelves.find((shelf) => shelf.id === movingShelf).position.z;
            setMoved(false);
		}

        if(movingShelf)
            checkCollisions();

	}, [moved, movingShelf]);

	const checkCollisions = () => {
		let collisions = [];
		const shelfToCheck = ref.current[movingShelf]; 
		const newBBox = new THREE.Box3().setFromObject(shelfToCheck); 
		
		// Reduce size of BoundingBox so it's possible to place two shelves close together
		const newMin = new THREE.Vector3().copy(newBBox.min).addScalar(0.01);
		const newMax = new THREE.Vector3().copy(newBBox.max).subScalar(0.01);
		const reducedBBox = new THREE.Box3(newMin, newMax);
		
		// Check collisions with other shelves
		for (const element of shelves) {
			if (element.id !== movingShelf) {
                const otherBBox = new THREE.Box3().setFromObject(ref.current[element.id]);   
                
                if (reducedBBox.intersectsBox(otherBBox)) {
                    collisions.push(movingShelf);
                    collisions.push(element.id);
                }
            }
		}
		
		// Check collisions with walls
        wallsRef.current.children.forEach(geometry => {
            if(geometry.name.startsWith('Wall')){
                const wallBoundingBox = new THREE.Box3().setFromObject(geometry);
                if (reducedBBox.intersectsBox(wallBoundingBox)) {
                    collisions.push(movingShelf);
			        collisions.push(geometry.name);
                }
            }
           
        });
		setIntersectingIds(collisions);
	}

    const checkFlip = () => {
        const rot = ref.current[movingShelf].rotation.y;
        const isFlipped = shelves.find((shelf) => shelf.id === movingShelf).isFlipped;
        if ((!isFlipped && Math.abs(rot - Math.PI / 2) < 0.0001) ||
            (isFlipped && Math.abs(rot - Math.PI / 2) > 0.0001)) {
            flipShelf(movingShelf);
        }
        checkCollisions();
    }

    useEffect(() => { 
		if(movingShelf) {
            setIsReadyToMove(true);
		}
        else {
            setIsReadyToMove(false);
        }
	}, [movingShelf]);

	return (
        <>
            {shelves.map((shelf) => (
                <ShelfMesh
                    shelf={shelf}
                    ref={(element) => ref.current[shelf.id] = element}
                    onClick={(binId) => handleClick(shelf.id, binId)}
                    onPointerMissed={handleUnclick}
                    selectedShelf={selectedShelf} 
                    products={products}
                    selectedBin={selectedBin}
                    selectedProduct={selectedProduct}
                />    
            ))}

            {isReadyToMove && (
                <TransformControls 
                    showY={false} 
                    onMouseUp={updatePos} 
                    object={ref.current[movingShelf]} 
                    mode="translate" 
                />
            )}
            {isReadyToMove && (
                <TransformControls 
                    onMouseUp={checkFlip} 
                    object={ref.current[movingShelf]} 
                    mode="rotate" 
                    axis="Y"
                    space="local"
                    showX={false}
                    showZ={false}
                    rotationSnap={Math.PI / 2}
                    size={1.5}
                />
            )}
        </>
	)
})

export default ShelvesRender;
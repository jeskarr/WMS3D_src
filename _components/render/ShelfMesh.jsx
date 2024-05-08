import { forwardRef } from 'react';
import * as THREE from 'three'
import BinMesh from '@_components/render/BinMesh';

const ShelfMesh = forwardRef((props, ref) => {

    const binSize = props.shelf.binSize;

    const bins = [];
    for (let i=0; i < props.shelf.height; i++){
        for(let j=0; j < props.shelf.width; j++){
            //const position = new THREE.Vector3(j*binSize, i*binSize + binSize/2, 0);
            const position = new THREE.Vector3(binSize * (j - props.shelf.width / 2 + 0.5), binSize * (i - props.shelf.height / 2 + 0.5), binSize / 2);
            bins.push(
                <BinMesh
                    args={[binSize, binSize, binSize]} 
                    position={position}
                    bin={props.shelf.bins[i][j]}
                    productColor={props.products?.find((product) => product.id === (props.shelf.bins[i][j].productId))?.color}
                    isSelectedShelf={props.selectedShelf === props.shelf.id}
                    isSelectedProduct={props.selectedProduct === props.shelf.bins[i][j].productId}
                    isSelectedBin={props.selectedBin === props.shelf.bins[i][j].id}
                    onClick={() => props.onClick(props.shelf.bins[i][j].id)}
                />
            );
        }
    }

    //console.log(props.shelf.position)
    return (
        <group 
            key={props.shelf.id} 
            ref={ref} 
            position={[props.shelf.position.x, props.shelf.position.y, props.shelf.position.z]}
            onPointerMissed={props.onPointerMissed} 
            rotation={[0, props.shelf.isFlipped ? Math.PI/2 : 0, 0]}
        >
            {bins}
        </group>
    ); 
})

export default ShelfMesh;

/*position={[props.shelf.position.x, 0, props.shelf.position.z]} */
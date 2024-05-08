import * as THREE from 'three';
import { Edges } from '../../node_modules/@react-three/drei';
import { useMemo } from 'react';

const DEFAULT_COLOR = '#454343';
const SELECTED_COLOR = '#00cd00';

const BinMesh = (props) => {
    const productScale = 0.5;
    const spacing = 0.0001; //to avoid bad flickering

    const onClick = (event) => {
        event.stopPropagation();
        props.onClick();
    }

    const generateTexture = useMemo(() => {
        if(props.bin.state !== 'EMPTY'){
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const width = 256;
            const height = 128;
            canvas.width = width;
            canvas.height = height;
            context.fillStyle = `rgb(${props.productColor.r.toFixed(0)}, ${props.productColor.g.toFixed(0)}, ${props.productColor.b.toFixed(0)})`;
            context.fillRect(0, 0, width, height); 
            if(props.bin.state === 'OUTGOING' || props.bin.state === 'INCOMING' ){
                const distanceToBlack = Math.sqrt(Math.pow(props.productColor.r, 2) + Math.pow(props.productColor.g, 2) + Math.pow(props.productColor.b, 2));
                const distanceToWhite = Math.sqrt(Math.pow(255 - props.productColor.r, 2) + Math.pow(255 - props.productColor.g, 2) + Math.pow(255 - props.productColor.b, 2));
                const textColor = distanceToBlack < distanceToWhite ? 'white' : 'black';
                context.font = 'bold 40px Arial';
                context.fillStyle = textColor;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(props.bin.state, width / 2, height / 2);
            }
            return new THREE.CanvasTexture(canvas);
        }
        else {
            return null;
        }
    }, [props.bin.state, props.productColor]);


    // CanvasTexture for front/back of bin with row-col
    const binCanvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const width = 256;
        const height = 128;
        canvas.width = width;
        canvas.height = height;
        context.fillStyle = (props.isSelectedShelf || props.isSelectedBin) ? SELECTED_COLOR : DEFAULT_COLOR; // Background color of the box side when selected
        context.fillRect(0, 0, width, height);
        context.font = 'bold 90px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`${props.bin.id.split('+')[1]}-${props.bin.id.split('+')[2]}`, width / 2, height / 2);
        return canvas;
    }, [props.isSelectedBin, props.isSelectedShelf]);
    
    const texture = useMemo(() => {
        const texture = new THREE.CanvasTexture(binCanvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1;
        return texture;
    }, [binCanvas]);

    return (
        <mesh position={props.position} onClick={onClick}>
            {/* Bin */}
            <boxGeometry args={[props.args[0]-spacing, props.args[1]-spacing, props.args[2]-spacing]} />
            <Edges />
            <meshBasicMaterial attach="material-0" color={(props.isSelectedShelf || props.isSelectedBin) ? SELECTED_COLOR : DEFAULT_COLOR} side={THREE.DoubleSide} />{/* right */}
            <meshBasicMaterial attach="material-1" color={(props.isSelectedShelf || props.isSelectedBin) ? SELECTED_COLOR : DEFAULT_COLOR} side={THREE.DoubleSide} />{/* left */}
            <meshBasicMaterial attach="material-2" color={(props.isSelectedShelf || props.isSelectedBin) ? SELECTED_COLOR : DEFAULT_COLOR} side={THREE.DoubleSide} />{/* top */}
            <meshBasicMaterial attach="material-3" color={(props.isSelectedShelf || props.isSelectedBin) ? SELECTED_COLOR : DEFAULT_COLOR} side={THREE.DoubleSide} />{/* bottom */}
            <meshLambertMaterial attach="material-4" color={(props.isSelectedShelf || props.isSelectedBin) ? SELECTED_COLOR : '#838383'} side={THREE.BackSide} map={texture} />{/* front */}
            <meshLambertMaterial attach="material-5" color={(props.isSelectedShelf || props.isSelectedBin) ? SELECTED_COLOR : '#838383'} side={THREE.BackSide} map={texture} />{/* back */}             
            
            {/* Prodotto */}
            {props.bin.state !== 'EMPTY' && (
                <mesh
                    position={[0, -props.args[1]*productScale/2 + spacing, 0]}
                    scale={[productScale, productScale, productScale]}
                >
                    <boxGeometry args={props.args} />
                    <meshBasicMaterial
                        map={generateTexture}
                    />
                    {(props.isSelectedProduct || props.isSelectedBin) && (
                        <Edges lineWidth={5} color="#ffa500" />
                    )}
                </mesh>
            )}
        </mesh>
    );
}

export default BinMesh;
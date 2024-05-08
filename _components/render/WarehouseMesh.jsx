import { Shape } from 'three';
import { Extrude } from "../../node_modules/@react-three/drei";
import * as THREE from 'three';
import { forwardRef } from 'react';

const WarehouseMesh = forwardRef(({height, points}, ref) => {
    const vertices = [];
    for(const point of points){
        vertices.push(new THREE.Vector2(point.x, point.z));
    }

    // Floor shape
    const floorShape = new THREE.Shape(vertices);
    const extrudeSettingsFloor = {
        depth: 0.01,
        bevelEnabled: false
    };

    // Wall shape
    const extrudeSettingsWalls = {
        depth: height,
        bevelEnabled: false
    };

    const createWallShape = (start, end) => {
        const wallShape = new Shape();
        wallShape.moveTo(start.x, start.y);
        wallShape.lineTo(end.x, end.y);
        return wallShape;    
    }

    return (
        <group rotation={[Math.PI / 2, 0, Math.PI]} key='warehouse'>
            <Extrude args={[floorShape, extrudeSettingsFloor]} >
                <meshBasicMaterial color='yellow'/>
            </Extrude>
            <group ref={ref} key='walls'>
                {vertices.map((v, index) => {
                    const nextIndex = (index + 1) % vertices.length;
                    const start = vertices[index];
                    const end = vertices[nextIndex];
                    const wallShape = createWallShape(start, end);
                    return (
                        <Extrude 
                            name={`Wall_${start.x}-${start.y}-${end.x}-${end.y}`}
                            key={`Wall_${start.x}-${start.y}-${end.x}-${end.y}`} 
                            args={[wallShape, extrudeSettingsWalls]} 
                            position={[0,0,-height]}
                        >
                            <meshLambertMaterial color='gray' side={THREE.BackSide} transparent opacity={0.5} />
                        </Extrude>
                    );
                })}
            </group>
        </group>
    ); 
})

export default WarehouseMesh;
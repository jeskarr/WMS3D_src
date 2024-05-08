import BinMesh from "@_components/render/BinMesh";
import ReactThreeTestRenderer from '../../../node_modules/@react-three/test-renderer';
import * as THREE from 'three';
import { waitFor } from "../../../node_modules/@testing-library/react";

test("BinMesh should render bin mesh and all bin childs", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[5, 5, 5]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 0, g: 75, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);
    // BinMesh: renderer.scene.children[0]
    expect(renderer.scene.children.length).toEqual(1);

    const binChildren = renderer.scene.children[0].allChildren;
    expect(binChildren.length).toEqual(8);
    
    let lineSegments2 = 0;
    let boxGeometry = 0;
    let meshBasicMaterial = 0;
    let meshLambertMaterial = 0;
    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        const type = renderer.scene.children[0].allChildren[index]._fiber.type;
        switch (type) {
            case 'LineSegments2':
                lineSegments2 += 1;
                break;
            case 'BoxGeometry':
                boxGeometry += 1;
                break;
            case 'MeshBasicMaterial':
                meshBasicMaterial += 1;
                break;
            case 'MeshLambertMaterial':
                meshLambertMaterial += 1;
                break;
            default:
                break;
        };       
    }

    expect(lineSegments2).toEqual(1);
    expect(boxGeometry).toEqual(1);
    expect(meshBasicMaterial).toEqual(4);
    expect(meshLambertMaterial).toEqual(2);
});

test("BinMesh should render bin mesh with correct dimensions", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[6, 6, 6]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 0, g: 75, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);
    
    expect(Math.round(renderer.scene.children[0]._fiber.geometry.parameters.width)).toEqual(6);
    expect(Math.round(renderer.scene.children[0]._fiber.geometry.parameters.height)).toEqual(6);
    expect(Math.round(renderer.scene.children[0]._fiber.geometry.parameters.depth)).toEqual(6);
});

test("BinMesh should render bin mesh with correct position", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[6, 6, 6]} 
        position={new THREE.Vector3(10, 2, 72)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 0, g: 75, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);
    
    expect(renderer.scene.children[0]._fiber.position.x).toEqual(10);
    expect(renderer.scene.children[0]._fiber.position.y).toEqual(2);
    expect(renderer.scene.children[0]._fiber.position.z).toEqual(72);
});

test("BinMesh should have default colors: #454343 for basic and 838383 for lambert", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[8, 8, 8]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 3, g: 24, b: 31}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);

    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        const obj = renderer.scene.children[0].allChildren[index];
        if(obj._fiber.type === 'MeshBasicMaterial') {
            expect(obj._fiber.color.getHexString()).toEqual("454343");
        } else if (obj._fiber.type === 'MeshLambertMaterial' ){
            expect(obj._fiber.color.getHexString()).toEqual("838383")
        }
    }
});

test("BinMesh should NOT render product mesh amongst the others if state is EMPTY", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[8, 8, 8]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 0, g: 5, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />)

    let check = false;
    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        renderer.scene.children[0].allChildren[index]._fiber.type === 'Mesh' ? check = true : undefined;        
    }
    expect(check).toEqual(false);
});

test("BinMesh should render product mesh amongst the others if state is STILL", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[2, 2, 2]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: "stillProdId", state: "STILL"}}
        productColor={{r: 0, g: 5, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);

    const binChildren = renderer.scene.children[0].allChildren;
    expect(binChildren.length).toEqual(9);

    let prodMesh = null;
    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        renderer.scene.children[0].allChildren[index]._fiber.type === 'Mesh' ? prodMesh = renderer.scene.children[0].allChildren[index] : undefined;        
    }
    expect(prodMesh).not.toEqual(null);
});

test("BinMesh should render product mesh amongst the others if state is OUTGOING", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[2, 2, 2]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: "stillProdId", state: "OUTGOING"}}
        productColor={{r: 200, g: 102, b: 250}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);

    const binChildren = renderer.scene.children[0].allChildren;
    expect(binChildren.length).toEqual(9);

    let prodMesh = null;
    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        renderer.scene.children[0].allChildren[index]._fiber.type === 'Mesh' ? prodMesh = renderer.scene.children[0].allChildren[index] : undefined;        
    }
    expect(prodMesh).not.toEqual(null);
});

test("BinMesh should render product mesh amongst the others if state is INCOMING", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[2, 2, 2]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: "stillProdId", state: "INCOMING"}}
        productColor={{r: 0, g: 5, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);

    const binChildren = renderer.scene.children[0].allChildren;
    expect(binChildren.length).toEqual(9);

    let prodMesh = null;
    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        renderer.scene.children[0].allChildren[index]._fiber.type === 'Mesh' ? prodMesh = renderer.scene.children[0].allChildren[index] : undefined;        
    }
    expect(prodMesh).not.toEqual(null);
});

test("BinMesh should call onClick on mesh click", async () => {
    const onClick = jest.fn();
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[8, 8, 8]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 0, g: 5, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={onClick}
    />);

    const bin = renderer.scene.children[0];
    await renderer.fireEvent(bin, 'click');
    await waitFor(() => {expect(onClick).toBeCalled()});
});

test("BinMesh should have color #00cd00 if isSelectedShelf = true", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[8, 8, 8]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 0, g: 5, b: 200}}
        isSelectedShelf={true}
        isSelectedProduct={false}
        isSelectedBin={false}
        onClick={jest.fn()}
    />);

    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        const obj = renderer.scene.children[0].allChildren[index];
        if(obj._fiber.type === 'MeshBasicMaterial' || obj._fiber.type === 'MeshLambertMaterial' ) {
            expect(obj._fiber.color.getHexString()).toEqual("00cd00");
        }
    }
});

test("BinMesh should have color #00cd00 if isSelectedBin = true", async () => {
    const renderer = await ReactThreeTestRenderer.create(<BinMesh
        args={[8, 8, 8]} 
        position={new THREE.Vector3(1, 2, 3)}
        bin={{id:"shelfId+1+4", productId: null, state: "EMPTY"}}
        productColor={{r: 0, g: 5, b: 200}}
        isSelectedShelf={false}
        isSelectedProduct={false}
        isSelectedBin={true}
        onClick={jest.fn()}
    />);

    for (let index = 0; index < renderer.scene.children[0].allChildren.length; index++) {
        const obj = renderer.scene.children[0].allChildren[index];
        if(obj._fiber.type === 'MeshBasicMaterial' || obj._fiber.type === 'MeshLambertMaterial' ) {
            expect(obj._fiber.color.getHexString()).toEqual("00cd00");
        }
    }
});
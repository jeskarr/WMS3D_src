import WarehouseMesh from "@_components/render/WarehouseMesh";
import ReactThreeTestRenderer from '../../../node_modules/@react-three/test-renderer';

const ref = {
    current: null
}
let height = 37;
let points = [
    {
        x: 0,
        z: 0
    },
    {
        x: 0,
        z: 50
    },
    {
        x: 53,
        z: 0
    },
    {
        x: 53,
        z: 50
    }
];

test('WarehouseMesh should render warehouse mesh and all childs', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<WarehouseMesh
        height={height} 
		points={points} 
		ref={ref}
    />);
    // WarehouseMesh: renderer.scene.children[0]
    expect(renderer.scene.children.length).toEqual(1);

    const warehouseChildren = renderer.scene.children[0].allChildren;
    expect(warehouseChildren.length).toEqual(2);
});

test('WarehouseMesh should render warehouse mesh with correct points', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<WarehouseMesh
        height={height} 
		points={points} 
		ref={ref}
    />);
    const warehouseChildren = renderer.scene.children[0].allChildren;

    //collect 3d warehouse points from shape
    let wPoints = [];
    for (let index = 0; index < 4; index++) {
        const point = warehouseChildren[1].children[index]._fiber.geometry.parameters.shapes.extractPoints().shape[0];
        wPoints.push({
            x: point.x,
            y: point.y
        });        
    }
    expect(wPoints).toContainEqual({x: 0, y: 0});
    expect(wPoints).toContainEqual({x: 0, y: 50});
    expect(wPoints).toContainEqual({x: 53, y: 0});
    expect(wPoints).toContainEqual({x: 53, y: 50});
});

test('WarehouseMesh should render warehouse mesh with correct height', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<WarehouseMesh
        height={height} 
		points={points} 
		ref={ref}
    />);
    const walls = renderer.scene.children[0].allChildren[1];

    for (let index = 0; index < 4; index++) {
        expect(walls.children[index]._fiber.geometry.parameters.options.depth).toEqual(37);     
    }
});
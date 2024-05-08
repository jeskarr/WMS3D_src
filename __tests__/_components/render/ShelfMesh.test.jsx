import ShelfMesh from "@_components/render/ShelfMesh";
import ReactThreeTestRenderer from '../../../node_modules/@react-three/test-renderer';

const shelf = {
    id: "myActiveShelfID",
    name: "myActiveShelf",
    binSize: 6,
    width: 1,
    height: 3,
    isFlipped: false,
    position: {
        x: 5,
        y: 20,
        z: 10
    },
    bins: [
        [
            {
                id: "myActiveShelfID+0+0",
                productId: null,
                state: "EMPTY"
            }
        ],
        [
            {
                id: "myActiveShelfID+1+0",
                productId: null,
                state: "EMPTY"
            }
        ],
        [
            {
                id: "myActiveShelfID+2+0",
                productId: "myProductId",
                state: "STILL"
            }
        ]
    ]
};
const products = [{
    name: "myProd", 
    color: {r: 2, g: 20, b: 200},
    id: "myProductId"
}];
const ref = {
    current: null
};

//BinMesh MOCK
jest.mock("../../../_components/render/BinMesh.jsx", () => (props) => (
    <mesh onClick={props.onClick}></mesh>
));

test('ShelfMesh should render shelf mesh and its bin mesh childs', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<ShelfMesh
        shelf={shelf}
        ref={ref}
        onClick={jest.fn()}
        onPointerMissed={jest.fn()}
        selectedShelf={null}
        selectedBin={null}
        selectedProduct={null}
        products={products}
    />);
    //ShelfMesh
    expect(renderer.scene.children.length).toEqual(1);
    //BinMesh
    expect(renderer.scene.children[0].allChildren.length).toEqual(3);
});

test('ShelfMesh should render shelf mesh with correct position', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<ShelfMesh
        shelf={shelf}
        ref={ref}
        onClick={jest.fn()}
        onPointerMissed={jest.fn()}
        selectedShelf={null}
        selectedBin={null}
        selectedProduct={null}
        products={products}
    />);
    
    expect(renderer.scene.children[0]._fiber.position).toEqual(shelf.position);
});

test('ShelfMesh should render shelf mesh with correct rotation', async () => {
    const renderer = await ReactThreeTestRenderer.create(<ShelfMesh
        shelf={shelf}
        ref={ref}
        onClick={jest.fn()}
        onPointerMissed={jest.fn()}
        selectedShelf={null}
        selectedBin={null}
        selectedProduct={null}
        products={products}
    />);

    expect(renderer.scene.children[0]._fiber.rotation._x).toEqual(0);
    expect(renderer.scene.children[0]._fiber.rotation._y).toEqual(0);
    expect(renderer.scene.children[0]._fiber.rotation._z).toEqual(0);
});

test('ShelfMesh should render shelf mesh with correct rotation if flipped', async () => {
    const flippedShelf = {
        ...shelf,
        isFlipped: true
    };
    const renderer = await ReactThreeTestRenderer.create(<ShelfMesh
        shelf={flippedShelf}
        ref={ref}
        onClick={jest.fn()}
        onPointerMissed={jest.fn()}
        selectedShelf={null}
        selectedBin={null}
        selectedProduct={null}
        products={products}
    />);

    expect(renderer.scene.children[0]._fiber.rotation._x).toEqual(0);
    expect(renderer.scene.children[0]._fiber.rotation._y).toEqual(Math.PI/2);
    expect(renderer.scene.children[0]._fiber.rotation._z).toEqual(0);
});

test('ShelfMesh should propagate bin click by calling onClick with bin data', async () => {
    const onClick = jest.fn();
    const renderer = await ReactThreeTestRenderer.create(<ShelfMesh
        shelf={shelf}
        ref={ref}
        onClick={onClick}
        onPointerMissed={jest.fn()}
        selectedShelf={null}
        selectedBin={null}
        selectedProduct={null}
        products={products}
    />);
    await renderer.fireEvent(renderer.scene.children[0].allChildren[0], 'click')

    expect(onClick).toBeCalled();
});
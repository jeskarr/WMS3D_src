import ThreeScene from "@_components/render/ThreeScene";
import ReactThreeTestRenderer from '../../../node_modules/@react-three/test-renderer';

let keyboardObjects = {
    forward: true,
    backward: false,
    left: false,
    right: false
};
const forward = jest.fn();
const truck = jest.fn();

jest.mock("../../../node_modules/@react-three/drei", () => {
    const { forwardRef } = jest.requireActual('react');
    return {
        useKeyboardControls: () => {return [undefined, () => {
            return keyboardObjects;
        }]},
        CameraControls: forwardRef(function CameraControls(props, ref) {
            ref.current = {
                enabled: true,
                forward: forward,
                truck: truck
            }
            return <></>;
        })
    }
});

test('ThreeScene should render ambientlight and gridhelper', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<ThreeScene isNavigating={false} />);
    
    expect(renderer.scene.children.length).toEqual(2);
    let ambientLight = false;
    let gridHelper = false;
    for (let index = 0; index < renderer.scene.children.length; index++) {
        renderer.scene.children[index]._fiber.type === 'AmbientLight' ? ambientLight = true : undefined;
        renderer.scene.children[index]._fiber.type === 'GridHelper' ? gridHelper = true : undefined;
    }
    expect(ambientLight).toEqual(true);
    expect(gridHelper).toEqual(true);
});

test('ThreeScene should render gridhelper on position [0, 0.01, 0]', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<ThreeScene isNavigating={false} />);
    
    let gridHelper = null;
    for (let index = 0; index < renderer.scene.children.length; index++) {
        renderer.scene.children[index]._fiber.type === 'GridHelper' ? gridHelper = renderer.scene.children[index]._fiber : undefined;
    }
    
    expect(gridHelper.position.x).toEqual(0);
    expect(gridHelper.position.y).toEqual(0.01);
    expect(gridHelper.position.z).toEqual(0);
});

test('ThreeScene should call forward with step 0.25 in CameraControls if KeyboardControls returns forward', async () => { 
    const renderer = await ReactThreeTestRenderer.create(<ThreeScene isNavigating={true} />);
    
    renderer.advanceFrames(1, null);

    expect(forward).toBeCalledWith(0.25);
});

test('ThreeScene should call forward with step -0.25 in CameraControls if KeyboardControls returns backward', async () => { 
    keyboardObjects = {
        forward: false,
        backward: true,
        left: false,
        right: false
    };
    const renderer = await ReactThreeTestRenderer.create(<ThreeScene isNavigating={true} />);
    
    renderer.advanceFrames(1, null);

    expect(forward).toBeCalledWith(-0.25);
});

test('ThreeScene should call truck with step -0.25 in CameraControls if KeyboardControls returns left', async () => { 
    keyboardObjects = {
        forward: false,
        backward: false,
        left: true,
        right: false
    };
    const renderer = await ReactThreeTestRenderer.create(<ThreeScene isNavigating={true} />);
    
    renderer.advanceFrames(1, null);

    expect(truck).toBeCalledWith(-0.25, 0);
});

test('ThreeScene should call truck with step 0.25 in CameraControls if KeyboardControls returns right', async () => { 
    keyboardObjects = {
        forward: false,
        backward: false,
        left: false,
        right: true
    };
    const renderer = await ReactThreeTestRenderer.create(<ThreeScene isNavigating={true} />);
    
    renderer.advanceFrames(1, null);

    expect(truck).toBeCalledWith(0.25, 0);
});
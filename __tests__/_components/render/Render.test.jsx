import Render from "@_components/render/Render";
import { render, screen, waitFor } from "../../../node_modules/@testing-library/react";
import userEvent from "../../../node_modules/@testing-library/user-event";
import { Canvas } from "../../../node_modules/@react-three/fiber";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Canvas mock
jest.mock("../../../node_modules/@react-three/fiber", () => {
    return {
        Canvas: jest.fn(props => <div data-testid="canvasContainer" onMouseDown={props.onMouseDown}></div>),
        addEffect: jest.fn()
    }
});

// WarehouseRender mock
jest.mock("../../../_components/render/WarehouseRender", () => 
    jest.fn(props => null)
);

// ThreeScene render
jest.mock("../../../_components/render/ThreeScene", () => 
    jest.fn(props => <div {...props} />)
);

test('Render should send isNavigating: false to ThreeScene to lock the camera movement at first render', async () => { 
    render(<Render />);

    await waitFor(() => expect(Canvas).toHaveBeenCalled());
    expect(Canvas.mock.calls[0][0].children[0].props).toEqual({isNavigating: false});
});

test('Render should send isNavigating: true to ThreeScene to unlock the camera movement on wheel click', async () => { 
    render(<Render />);
    const canvasContainer = screen.getByTestId("canvasContainer");

    await userEvent.pointer({ target: canvasContainer, keys: '[MouseMiddle]' });
    await waitFor(() => expect(Canvas).toHaveBeenCalled());
    expect(Canvas.mock.calls[1][0].children[0].props).toEqual({isNavigating: true});
});
import { screen, fireEvent } from "../../../node_modules/@testing-library/react";
// antd ColorPicker utils
export const ColorPickerUtils = {
    getColor: (input) => {
        return (input.children[0]).children[0].style.background;
    },
    setColor: (input, hexcolor) => {
        fireEvent.click((input.children[0]).children[0]);
        const picker = screen.getAllByRole("textbox")[1];
        fireEvent.change(picker, {target: {value: hexcolor}})
    }
}
import ErrorModal from "@_components/ErrorModal";
import { render, screen } from "../../node_modules/@testing-library/react";
import "../../node_modules/@testing-library/jest-dom";

describe("Components render", () => {
    test('ErrorModal should display the error content', () => { 
        const error = "Some very serious error";
        render(<ErrorModal error={error} onCancel={null} />);
        
        const errorOnScreen = screen.getByText(/some very serious error/i);
        expect(errorOnScreen).toBeInTheDocument();
    });
    
    test('ErrorModal should inform the user that an error occurred', () => { 
        const error = "The server has exploded";
        render(<ErrorModal error={error} onCancel={null} />);
        
        const errorInformation = screen.getByText(/errore/i);
        expect(errorInformation).toBeInTheDocument();
    });
});
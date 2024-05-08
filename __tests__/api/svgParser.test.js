import "@app/api/parsing/svgParser/route";
import { POST } from "@app/api/parsing/svgParser/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => {
    return {
        NextResponse: {
            json: jest.fn()
        }
    }
});

let correctSvg = "";

const req = {
    json: jest.fn(() => { 
        return correctSvg
    })
};

beforeEach(() => {
    correctSvg = {
        data:
            `
                <svg height="260" width="500">
                    <polygon points="300,210 170,250 123,234 100,40"/>
                </svg>
            `
    };
});

test('svgParser should return error false if svg in req is correct', async () => { 
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: false, message: "OK"}, {status: 200});
    });
});

test('svgParser should return error true if svg in req is incorrect', async () => {
    correctSvg = {
        data: 
            `
            <svg height="260" width="500">
                <polygon points=""/>
            </svg>
            `
    }
    
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: true, message: "Il file SVG è in un formato non valido"}, {status: 200});
    });
});
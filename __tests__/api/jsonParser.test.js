import "@app/api/parsing/jsonParser/route";
import { POST } from "@app/api/parsing/jsonParser/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => {
    return {
        NextResponse: {
            json: jest.fn()
        }
    }
});

let correctJson = {}

const req = {
    json: jest.fn(() => { 
        return correctJson
    })
};

beforeEach(() => {
    correctJson = {
        whsName: "MyFirstWhs",
        whsHeight: 31,
        whsPoints: [
            {
                "x": 0,
                "z": 0
            },
            {
                "x": 0,
                "z": 50
            },
            {
                "x": 53,
                "z": 0
            },
            {
                "x": 53,
                "z": 50
            }
        ],
        products: [
            {
                name: "firstProd", 
                color: {"r": 2, "g": 20, "b": 200},
                id: "myProductId"
            }
        ],
        shelves: [
            {
                id: "firstShelfID",
                name: "firstShelf",
                binSize: 4,
                width: 3,
                height: 2,
                isFlipped: true,
                position: {
                    x: 4,
                    y: 5,
                    z: 7
                },
                bins: [
                    [
                        {
                            id: "firstShelfID+0+0",
                            productId: null,
                            state: "EMPTY"
                        },
                        {
                            id: "firstShelfID+0+1",
                            productId: null,
                            state: "EMPTY"
                        },
                        {
                            id: "firstShelfID+0+2",
                            productId: null,
                            state: "EMPTY"
                        }
                    ],
                    [
                        {
                            id: "firstShelfID+1+0",
                            productId: null,
                            state: "EMPTY"
                        },
                        {
                            id: "firstShelfID+1+1",
                            productId: "myProductId",
                            state: "INCOMING"
                        },
                        {
                            id: "firstShelfID+1+2",
                            productId: null,
                            state: "EMPTY"
                        }
                    ]
                ]
            },
            {
                id: "secondShelfID",
                name: "secondShelf",
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
                            id: "secondShelfID+0+0",
                            productId: null,
                            state: "EMPTY"
                        }
                    ],
                    [
                        {
                            id: "secondShelfID+1+0",
                            productId: null,
                            state: "EMPTY"
                        }
                    ],
                    [
                        {
                            id: "secondShelfID+2+0",
                            productId: "myProductId",
                            state: "OUTGOING"
                        }
                    ]
                ]
            }
        ],
        movements: [
            {
                id: "firstMovementId",
                fromId: "secondShelfID",
                fromRow: 2,
                fromCol: 0,
                toId: "firstShelfID",
                toRow: 1,
                toCol: 1
            }
        ]
    };
});

test('jsonParser should return error false if json in req is correct', async () => { 
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: false, message: "OK"}, {status: 200});
    });
});

test('jsonParser should return error false if json in req has missing info', async () => {
    delete correctJson.products;

    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: true, message: "Il file JSON è in un formato non valido"}, {status: 200});
    });
});

test('jsonParser should return error false if json in req has mismatched types (products should be array)', async () => {
    correctJson.products = 
    {
        0: {
            name: "firstProd", 
            color: {"r": 2, "g": 20, "b": 200},
            id: "myProductId"
        }
    };
    
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: true, message: "Il file JSON è in un formato non valido"}, {status: 200});
    });
});

test('jsonParser should return error false if json in req has mismatched types (whsPoints)', async () => {
    correctJson.whsPoints = 
    [
        {
            "x": 0,
            "z": 0
        },
        "suspicious point",
        {
            "x": 53,
            "z": 0
        },
        {
            "x": 53,
            "z": 50
        }
    ];  
    
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: true, message: "Il file JSON è in un formato non valido"}, {status: 200});
    });
});

test('jsonParser should return error false if json in req has mismatched types (products)', async () => {
    correctJson.products = 
    [
        {
            name: "firstProd", 
            color: {"r": 2, "g": 20, "b": 200},
            id: 50
        }
    ];  
    
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: true, message: "Il file JSON è in un formato non valido"}, {status: 200});
    });
});

test('jsonParser should return error false if json in req has mismatched types (shelves)', async () => {
    correctJson.shelves = 
    [
        {
            id: "secondShelfID",
            name: "secondShelf",
            binSize: "6",
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
                        id: "secondShelfID+0+0",
                        productId: null,
                        state: "EMPTY"
                    }
                ],
                [
                    {
                        id: "secondShelfID+1+0",
                        productId: null,
                        state: "EMPTY"
                    }
                ],
                [
                    {
                        id: "secondShelfID+2+0",
                        productId: "myProductId",
                        state: "OUTGOING"
                    }
                ]
            ]
        }
    ];   
    
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: true, message: "Il file JSON è in un formato non valido"}, {status: 200});
    });
});

test('jsonParser should return error false if json in req has mismatched types (bins)', async () => {    
    correctJson.shelves = 
    [
        {
            id: "secondShelfID",
            name: "secondShelf",
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
                        id: "secondShelfID+0+0",
                        productId: null,
                        state: 0
                    }
                ],
                [
                    {
                        id: "secondShelfID+1+0",
                        productId: null,
                        state: "EMPTY"
                    }
                ],
                [
                    {
                        id: "secondShelfID+2+0",
                        productId: "myProductId",
                        state: "OUTGOING"
                    }
                ]
            ]
        }
    ];
    
    return POST(req).then(() => {
        expect(NextResponse.json).toHaveBeenCalledWith({err: true, message: "Il file JSON è in un formato non valido"}, {status: 200});
    });
});